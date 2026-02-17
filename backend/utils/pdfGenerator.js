const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { transliterate } = require('transliteration');

// Helper to ensure text is English-compatible (Transliteration)
// Converts Arabic characters to Latin (e.g., "محمد" -> "mhmd" or similar phonetic)
const toEnglish = (text) => {
    if (!text) return '';
    return transliterate(String(text));
};

// Map specific values to nice English labels
const getPaymentMethodLabel = (method) => {
    const map = {
        'vodafone-cash': 'Vodafone Cash',
        'cod': 'Cash on Delivery',
        'insta-pay': 'InstaPay'
    };
    return map[method] || toEnglish(method); // Fallback to transliteration
};

const getGovernorateLabel = (gov) => {
    // Basic mapping for common Governorates to look nice
    const map = {
        'Cairo': 'Cairo',
        'Giza': 'Giza',
        'Alexandria': 'Alexandria',
        'Dakahlia': 'Dakahlia',
        'Red Sea': 'Red Sea',
        'Beheira': 'Beheira',
        'Fayoum': 'Fayoum',
        'Gharbiya': 'Gharbiya',
        'Ismailia': 'Ismailia',
        'Menofia': 'Menofia',
        'Minya': 'Minya',
        'Qaliubiya': 'Qaliubiya',
        'New Valley': 'New Valley',
        'Suez': 'Suez',
        'Aswan': 'Aswan',
        'Assiut': 'Assiut',
        'Beni Suef': 'Beni Suef',
        'Port Said': 'Port Said',
        'Damietta': 'Damietta',
        'Sharkia': 'Sharkia',
        'South Sinai': 'South Sinai',
        'Kafr Al Sheikh': 'Kafr Al Sheikh',
        'Matrouh': 'Matrouh',
        'Luxor': 'Luxor',
        'Qena': 'Qena',
        'North Sinai': 'North Sinai',
        'Sohag': 'Sohag'
    };
    // Check if it exists in map (English key) or try to transliterate Arabic key
    return map[gov] || toEnglish(gov);
};


const Settings = require('../models/Settings');

exports.generateOrderPDF = async (order) => {
    try {
        // Fetch Settings
        const settings = await Settings.getSettings();

        return new Promise((resolve, reject) => {
            try {
                // Standard PDFKit setup (default Helvetica font supports English perfectly)
                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4'
                });

                // --- HEADER ---
                doc.fontSize(20).font('Helvetica-Bold').text('RAHHALAH', { align: 'center' });
                doc.fontSize(10).font('Helvetica').text('Clothing Brand', { align: 'center' });
                doc.moveDown();

                doc.fontSize(16).text('DELIVERY RECEIPT', { align: 'center', characterSpacing: 2 });
                doc.moveDown(1.5);

                // --- BOXED LAYOUT ---
                const startY = doc.y;

                // Draw Box
                doc.rect(50, startY, 495, 120).fill('#f8f9fa').stroke('#dee2e6');
                doc.fillColor('black');

                // Helper for Lines
                const drawLine = (label, value, x, y) => {
                    doc.font('Helvetica-Bold').fontSize(9).text(label, x, y, { width: 100, align: 'left' });
                    doc.font('Helvetica').fontSize(10).text(value, x + 90, y, { width: 300, align: 'left' });
                };

                // Order Info (Left Column)
                doc.fontSize(12).font('Helvetica-Bold').text('Order Details', 60, startY + 15, { underline: true });

                drawLine('Order ID:', order._id.toString().slice(-6).toUpperCase(), 60, startY + 35);
                drawLine('Date:', new Date(order.createdAt).toLocaleDateString('en-GB'), 60, startY + 50); // DD/MM/YYYY
                drawLine('Status:', toEnglish(order.status).toUpperCase(), 60, startY + 65);

                // Customer Info (Right Column logic, or just below if simple)
                // Let's do columns: Customer on Right side? No, simpler to stack or split 50/50

                // Let's split 50/50
                const col2X = 300;
                doc.fontSize(12).font('Helvetica-Bold').text('Customer', col2X, startY + 15, { underline: true });

                drawLine('Name:', toEnglish(order.customerName), col2X, startY + 35);
                drawLine('Phone:', toEnglish(order.phone), col2X, startY + 50);

                // Address might need more space
                const address = `${getGovernorateLabel(order.governorate)} - ${toEnglish(order.address)}`;

                doc.font('Helvetica-Bold').fontSize(9).text('Address:', col2X, startY + 65, { width: 50, align: 'left' });
                doc.font('Helvetica').fontSize(9).text(address, col2X + 50, startY + 65, { width: 180, align: 'left' });

                // Move cursor
                doc.y = startY + 140;
                doc.moveDown();


                // --- ITEMS TABLE ---
                doc.fontSize(12).font('Helvetica-Bold').text('Ordered Items', 50, doc.y);
                doc.moveDown(0.5);

                const tableTop = doc.y;
                const itemX = 50;
                const qtyX = 300;
                const sizeX = 360;
                const priceX = 450;

                // Header Background
                doc.rect(50, tableTop - 5, 495, 20).fill('#333');
                doc.fillColor('white').fontSize(9).font('Helvetica-Bold');

                doc.text('ITEM', itemX + 10, tableTop, { width: 230, align: 'left' });
                doc.text('QTY', qtyX, tableTop, { width: 40, align: 'center' });
                doc.text('SIZE', sizeX, tableTop, { width: 40, align: 'center' });
                doc.text('PRICE', priceX, tableTop, { width: 80, align: 'right' });

                doc.fillColor('black');
                doc.moveDown(2);

                // Items Loop
                doc.fontSize(9).font('Helvetica');

                order.items.forEach((item, i) => {
                    const y = doc.y;

                    // Zebra Striping
                    if (i % 2 === 0) {
                        doc.rect(50, y - 5, 495, 20).fill('#f9f9f9');
                        doc.fillColor('black');
                    }

                    const total = item.priceAtPurchase * item.quantity;
                    const title = toEnglish(item.product?.title || 'Unknown Product'); // Transliterate product title

                    doc.text(title, itemX + 10, y, { width: 230, align: 'left' });
                    doc.text(item.quantity.toString(), qtyX, y, { width: 40, align: 'center' });
                    doc.text(toEnglish(item.size || '-'), sizeX, y, { width: 40, align: 'center' });
                    doc.text(`${total} EGP`, priceX, y, { width: 80, align: 'right' });

                    if (item.color) {
                        doc.fontSize(8).fillColor('#666');
                        doc.text(`Color: ${toEnglish(item.color)}`, itemX + 10, y + 10);
                        doc.fontSize(9).fillColor('black');
                        doc.moveDown(0.5);
                    }

                    doc.moveDown(1);
                    doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(0.5).strokeColor('#eee').stroke();
                    doc.moveDown(0.5);
                });

                doc.moveDown();

                // --- TOTALS ---
                const subtotal = order.total - order.shippingCost;

                const drawSummary = (label, value, bold = false) => {
                    if (bold) doc.font('Helvetica-Bold');
                    else doc.font('Helvetica');

                    doc.text(label, 350, doc.y, { width: 100, align: 'right' });
                    doc.text(value, 460, doc.y, { width: 80, align: 'right' });
                    doc.moveDown(0.5);
                };

                drawSummary('Subtotal:', `${subtotal} EGP`);
                drawSummary('Shipping:', `${order.shippingCost} EGP`);

                doc.moveTo(350, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor('black').stroke();
                doc.moveDown(0.5);

                drawSummary('TOTAL:', `${order.total} EGP`, true);

                doc.moveDown(2);

                // Payment Method
                const pmLabel = getPaymentMethodLabel(order.paymentMethod);
                doc.rect(150, doc.y - 5, 300, 25).fill('#eee').stroke('#ddd');
                doc.fillColor('#333').font('Helvetica').fontSize(10);
                doc.text(`Payment: ${pmLabel}`, 150, doc.y + 6, { width: 300, align: 'center' });

                // --- FOOTER (Dynamic Contact Info) ---
                doc.moveDown(4);
                doc.fontSize(8).fillColor('#666');
                doc.text('Thank you for shopping | Rahhalah', { align: 'center' });
                doc.moveDown(0.5);

                // Contact Info Line
                let contactInfo = [];
                if (settings.email) contactInfo.push(`Email: ${settings.email}`);
                if (settings.phone) contactInfo.push(`Tel: ${settings.phone}`);

                if (contactInfo.length > 0) {
                    doc.text(contactInfo.join('  |  '), { align: 'center' });
                    doc.moveDown(0.3);
                }

                // Social Media Line
                let socialLinks = [];
                if (settings.facebook) socialLinks.push(`FB: ${settings.facebook}`);
                if (settings.instagram) socialLinks.push(`IG: ${settings.instagram}`);
                if (settings.twitter) socialLinks.push(`TikTok: ${settings.twitter}`); // Using twitter field for TikTok as requested/implied or fallback

                if (socialLinks.length > 0) {
                    doc.text(socialLinks.join('  |  '), { align: 'center' });
                }

                resolve(doc);

            } catch (error) {
                console.error('PDF Generation Error:', error);
                reject(error);
            }
        });
    } catch (error) {
        console.error('Error fetching settings for PDF:', error);
        throw error; // Propagate error
    }
};
