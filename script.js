function sendmail(event) {
  event.preventDefault(); // Prevent default form submission

  const params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  // Send booking details to your business email
  emailjs.send("service_c41ywsm", "template_2eewru7", params)
    .then(function(response) {
      console.log("Main email sent!", response.status, response.text);

      // Now send auto-reply to the customer
      return emailjs.send("service_c41ywsm", "template_84wdzkd", params);
    })
    .then(function(replyResponse) {
      console.log("Auto-reply sent!", replyResponse.status, replyResponse.text);
      alert("Your booking has been submitted! We'll reply to you shortly.");
    })
    .catch(function(error) {
      console.error("Error sending email(s):", error);
      alert("Oops! Something went wrong. Please try again later.");
    });
}
