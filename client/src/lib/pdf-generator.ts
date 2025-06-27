import jsPDF from 'jspdf';
import { Story } from '@shared/schema';

export async function generateStoryPDF(story: Story): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const textWidth = pageWidth - (margin * 2);
  
  // Title
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  const titleLines = pdf.splitTextToSize(story.title, textWidth);
  let yPosition = margin + 20;
  
  titleLines.forEach((line: string) => {
    pdf.text(line, margin, yPosition);
    yPosition += 10;
  });
  
  yPosition += 10;
  
  // Story details
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Age: ${story.age} years • ${story.storyLength} minutes • ${story.curriculumStage}`, margin, yPosition);
  yPosition += 15;
  
  // Add illustration if available
  if (story.illustrationUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          const imgWidth = 150;
          const imgHeight = (img.height * imgWidth) / img.width;
          
          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.addImage(img, 'JPEG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 20;
          resolve(void 0);
        };
        img.onerror = reject;
        img.src = story.illustrationUrl!;
      });
    } catch (error) {
      console.warn('Failed to add illustration to PDF:', error);
    }
  }
  
  // Story content
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  
  const paragraphs = story.content.split('\n\n');
  
  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) return;
    
    const lines = pdf.splitTextToSize(paragraph, textWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });
    
    yPosition += 5; // Space between paragraphs
  });
  
  // Moral lesson
  if (story.moralTheme) {
    yPosition += 10;
    if (yPosition > pageHeight - margin - 40) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Tonight's Lesson:", margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "italic");
    const moralLines = pdf.splitTextToSize(story.moralTheme, textWidth);
    moralLines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });
  }
  
  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Bedtime Stories - Created ${new Date(story.createdAt || '').toLocaleDateString('en-GB')}`,
      margin,
      pageHeight - 10
    );
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
  }
  
  // Download the PDF
  pdf.save(`${story.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}
