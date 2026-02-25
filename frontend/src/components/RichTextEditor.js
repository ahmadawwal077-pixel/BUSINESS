import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  // Define toolbar modules with professional formatting options
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],           // Headings (h1, h2, h3)
      [{ 'size': ['small', false, 'large'] }],    // Font size
      ['bold', 'italic', 'underline', 'strike'],  // Basic formatting
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
      [{ 'script': 'sub'}, { 'script': 'super' }], // Superscript/subscript
      [{ 'align': [] }],                           // Alignment
      [{ 'color': [] }, { 'background': [] }],    // Text and background color
      ['blockquote', 'code-block'],                // Quote and code
      ['link', 'image'],                           // Media
      ['clean']                                     // Clear formatting
    ]
  };

  // Define formats allowed in the editor
  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script',
    'align',
    'color', 'background',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write your course description here...'}
        style={{
          height: '300px',
          marginBottom: '50px',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      />
      <style>{`
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border: 2px solid #e5e7eb;
          backgroundColor: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border: 2px solid #e5e7eb;
          border-top: none;
          fontSize: '0.9rem',
        }
        .rich-text-editor .ql-editor {
          minHeight: '250px',
          lineHeight: '1.6',
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          fontStyle: 'italic',
        }
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #3b82f6;
        }
        .rich-text-editor .ql-toolbar button:hover {
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
