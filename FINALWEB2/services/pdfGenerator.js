const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generatePDF = (deliveryNote, signatureUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `albaran_${deliveryNote._id}.pdf`;
      const filePath = path.join(__dirname, "../uploads/pdfs", fileName);

      const doc = new PDFDocument({ margin: 40 });
      doc.pipe(fs.createWriteStream(filePath));

      // Encabezado de la Empresa
      doc.fontSize(20).text("EMPRESA", { align: "center" });
      doc.moveDown(0.5);

      // Datos del Albarán y del Cliente
      doc.fontSize(12);
      doc.text(`Albarán Nº: ${deliveryNote._id}`, { align: "left" });
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, { align: "right" });
      doc.moveDown(0.5);

      doc.text(`Cliente: ${deliveryNote.cliente?.nombre || "Desconocido"}`);
      doc.text(`NIF: ${deliveryNote.cliente?.nif || "Desconocido"}`);
      doc.text(`Dirección: ${deliveryNote.cliente?.direccion || "No registrada"}`);
      doc.text(`Teléfono: ${deliveryNote.cliente?.contacto || "No especificado"}`);
      doc.moveDown(1);

      // Línea divisoria
      doc.moveDown(0.5).lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      // Detalles del Albarán
      doc.fontSize(16).text("Detalles del Albarán", { align: "left", underline: true });
      doc.fontSize(12).text(`Tipo: ${deliveryNote.tipo}`, { align: "left" });
      doc.text(`Descripción: ${deliveryNote.descripcion}`, { align: "left" });
      doc.moveDown(1);

      // Tabla de Materiales u Horas
      doc.fontSize(14).text("Productos entregados:", { underline: true });
      doc.moveDown(0.5);

      // Cabecera de la tabla
      doc.fontSize(12).text("Código", 50, doc.y, { width: 100 });
      doc.text("Artículo", 200, doc.y, { width: 200 });
      doc.text("Cantidad", 400, doc.y, { width: 100, align: "right" });
      doc.moveDown(0.5).lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();

      // Contenido de la tabla
      if (deliveryNote.tipo === "materiales") {
        deliveryNote.materiales.forEach(item => {
          doc.text(item.codigo || "N/A", 50, doc.y + 5);
          doc.text(item.nombre, 200, doc.y + 5);
          doc.text(item.cantidad.toString(), 400, doc.y + 5, { align: "right" });
          doc.moveDown(0.2).lineWidth(0.5).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
        });
      } else if (deliveryNote.tipo === "horas") {
        doc.text("Horas trabajadas:", { align: "left" });
        doc.text(`Total de horas: ${deliveryNote.horas}`, { align: "right" });
        doc.moveDown(0.5);
      }
      doc.moveDown(1);

      // Firma
      doc.moveDown(1);
      doc.text("Firma del receptor:", { align: "left" });
      if (signatureUrl) {
        const signaturePath = path.join(__dirname, "..", signatureUrl);
        if (fs.existsSync(signaturePath)) {
          doc.image(signaturePath, { fit: [100, 50], align: "left" });
        } else {
          doc.text("________________________", { align: "left" });
        }
      } else {
        doc.text("________________________", { align: "left" });
      }
      doc.text("Fecha, firma / sello", { align: "left" });
      doc.moveDown();

      // Pie de página
      doc.moveDown(2);
      doc.text("EMPRESA", 40, doc.y, { align: "left" });
      doc.text("Calle Ejemplo 123, Madrid", { align: "left" });
      doc.text("Teléfono: 912345678", { align: "left" });
      doc.text("Correo: info@empresa.com", { align: "left" });

      doc.text("IBAN: ES12345678901234567890", 400, doc.y, { align: "right" });
      doc.text("Titular de la cuenta: EMPRESA", { align: "right" });

      doc.end();
      resolve(`/uploads/pdfs/${fileName}`);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generatePDF;
