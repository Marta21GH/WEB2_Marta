const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = (deliveryNote) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `albaran_${deliveryNote._id}.pdf`;
      const filePath = path.join(__dirname, "../uploads/pdfs", fileName);
      
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));

      // Cabecera del PDF
      doc.fontSize(20).text("Albarán de Trabajo", { align: "center" });
      doc.moveDown();
      
      // Información del Albarán
      doc.fontSize(14).text(`Tipo: ${deliveryNote.tipo}`);
      doc.text(`Descripción: ${deliveryNote.descripcion || "Sin descripción"}`);
      doc.text(`Proyecto: ${deliveryNote.proyecto}`);
      doc.text(`Creado por: ${deliveryNote.usuario}`);
      doc.text(`Fecha: ${new Date(deliveryNote.fechaCreacion).toLocaleString()}`);
      doc.moveDown();

      // Datos Específicos del Albarán
      if (deliveryNote.tipo === "horas") {
        doc.text(`Horas Trabajadas: ${deliveryNote.horas}`);
      } else if (deliveryNote.tipo === "materiales") {
        doc.text("Materiales Utilizados:");
        deliveryNote.materiales.forEach((material) => {
          doc.text(`- ${material.nombre}: ${material.cantidad}`);
        });
      }

      // Pie de página
      doc.moveDown();
      doc.fontSize(10).text("Documento generado automáticamente", { align: "center" });

      // Finalizar y guardar el PDF
      doc.end();
      resolve(`/uploads/pdfs/${fileName}`);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generatePDF;
