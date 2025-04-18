function sendmail(event) {
  event.preventDefault(); // Prevent form refresh

  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
    .then(function(response) {
      console.log("Success!", response.status, response.text);
      alert("Your booking has been submitted! We will get back to you shortly.");
    })
    .catch(function(error) {
      console.error("Failed to send email:", error);
      alert("There was an error sending your message. Please try again later.");
    });
}
