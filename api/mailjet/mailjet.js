const mailjet = require ('node-mailjet')
.connect('5be6e55f94c28dcfaedff0bde5437f00', '212af3a4671fc9eb13f0d86d90755545');

const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "project.passreset@gmail.com",
        "Name": "Password"
      },
      "To": [
        {
          "Email": "project.passreset@gmail.com",
          "Name": "Password"
        }
      ],
      "Subject": "Password reset",
      "TextPart": "Your password has been reset. Your new password is _, please change it as soon as possible!"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body);
  })
  .catch((err) => {
    console.log(err.statusCode);
  })