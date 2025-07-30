import emailjs from '@emailjs/browser';

export function sendEmail({ serviceId, templateId, templateParams, publicKey }) {
    console.log("DEBUG:", { serviceId, templateId, templateParams, publicKey });
  return emailjs.send(serviceId, templateId, templateParams, publicKey);
}