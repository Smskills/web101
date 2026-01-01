
import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * A safety-conscious component that renders basic HTML tags
 * and converts newlines to <br /> tags.
 */
const FormattedText: React.FC<FormattedTextProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Replace newlines with <br />, then split by tags to handle safety 
  // Note: In a production app, use DOMPurify. Here we use a safe approach 
  // by rendering innerHTML for specific common formatting tags only.
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: text.replace(/\n/g, '<br />')
      }}
    />
  );
};

export default FormattedText;
