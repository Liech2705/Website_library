import emailjs from 'emailjs-com';

/**
 * Gửi email sử dụng EmailJS
 * @param {Object} params
 * @param {string} params.templateId - Template ID của EmailJS
 * @param {string} params.userId - Public key (user ID) của EmailJS
 * @param {Object} params.templateParams - Các biến truyền vào template (ví dụ: { user_name, user_email, message })
 * @returns {Promise}
 */
export function sendEmail({ templateId, userId, templateParams }) {
    return emailjs.send('service_uemnj2h', templateId, templateParams, userId);
} 