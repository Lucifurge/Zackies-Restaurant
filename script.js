function sendmail(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_c41ywsm", "template_2eewru7", params)
    .then(function(response) {
      alert("Email sent successfully!");
      console.log("SUCCESS!", response.status, response.text);
    }, function(error) {
      alert("Failed to send email. Please try again.");
      console.error("FAILED...", error);
    });
}
