import React from 'react';
import { ContactSection } from '../components/ContactSection';

export const Contact: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0f]">
      {/* Standalone Page wrapper renders the Contact Form component */}
      <ContactSection />
    </div>
  );
};

export default Contact;
