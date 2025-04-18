function sendmail(event) {
  event.preventDefault(); // Prevent page reload

  const form = event.target;

  const name = form.querySelector('input[id$="name"]').value;
  const email = form.querySelector('input[id$="email"]').value;
  const subject = form.querySelector('input[id$="subject"]').value;
  const message = form.querySelector('textarea[id$="message"]').value;

  const params = { name, email, subject, message };

  // Send booking details to business email
  emailjs.send("service_c41ywsm", "template_2eewru7", params)
    .then((response) => {
      console.log("Main email sent!", response.status, response.text);
      // Send auto-reply to the customer
      return emailjs.send("service_c41ywsm", "template_84wdzkd", params);
    })
    .then((replyResponse) => {
      console.log("Auto-reply sent!", replyResponse.status, replyResponse.text);
      alert("Your booking has been submitted! We'll reply to you shortly.");
      form.reset(); // Clear the form
    })
    .catch((error) => {
      console.error("Error sending email(s):", error);
      alert("Oops! Something went wrong. Please try again later.");
    });
}
