import PDFDocument from 'pdfkit';

export const generatePDF = (attempt, dataCallback, endCallback) => {
    const doc = new PDFDocument();

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    doc.fontSize(25).text('Quiz Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Attempt ID: ${attempt.id}`);
    doc.text(`Topic: ${attempt.topic}`);
    doc.text(`Difficulty: ${attempt.difficulty}`);
    doc.text(`Score: ${attempt.score} / ${attempt.total_questions}`);
    doc.text(`Time Taken: ${attempt.time_taken} seconds`);
    doc.text(`Date: ${new Date(attempt.timestamp).toLocaleString()}`);

    doc.end();
};
