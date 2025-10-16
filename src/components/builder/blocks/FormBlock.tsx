import React, { useState } from "react";
import { Block, FormBlockContent, FormField } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import { generateFieldId } from "../../../utils/blockUtils";
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface FormBlockProps {
  block: Block;
  isPreview?: boolean;
}

const FormBlock: React.FC<FormBlockProps> = ({ block, isPreview = false }) => {
  const { updateBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const content = block.content as FormBlockContent;

  const handleActionChange = (newAction: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        action: newAction,
      },
    });
  };

  const handleMethodChange = (newMethod: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        method: newMethod as any,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm("Are you sure you want to remove this form block?")) {
      deleteBlock(block.id);
    }
  };

  const handleSubmitTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        submitText: newText,
      },
    });
  };

  const handleAddField = (fieldType: string) => {
    const newField: FormField = {
      id: generateFieldId(),
      type: fieldType as any,
      name: `field_${Date.now()}`,
      label: "New Field",
      placeholder: "",
      required: false,
    };

    updateBlock(block.id, {
      content: {
        ...content,
        fields: [...content.fields, newField],
      },
    });
  };

  const handleFieldChange = (fieldId: string, updates: Partial<FormField>) => {
    updateBlock(block.id, {
      content: {
        ...content,
        fields: content.fields.map((field) =>
          field.id === fieldId ? { ...field, ...updates } : field
        ),
      },
    });
  };

  const handleRemoveField = (fieldId: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        fields: content.fields.filter((field) => field.id !== fieldId),
      },
    });
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select an option</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name={field.name}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    value={option}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isPreview) {
    return (
      <form
        action={content.action}
        method={content.method}
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Form</h3>
        {content.fields.map(renderField)}
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          {content.submitText}
        </button>
      </form>
    );
  }

  return (
    <div className="relative group">
      {/* Block Controls */}
      {!isEditing && (
        <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-2 z-50">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <ClipboardDocumentListIcon className="w-3 h-3" />
            <span>EDIT</span>
          </button>
          <button
            onClick={handleRemoveBlock}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
          >
            <TrashIcon className="w-3 h-3" />
            <span>REMOVE</span>
          </button>
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Form</h3>
        {content.fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ClipboardDocumentListIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No form fields yet</p>
            <p className="text-xs">Add fields to build your form</p>
          </div>
        ) : (
          content.fields.map(renderField)
        )}
        <button
          type="button"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          {content.submitText}
        </button>
      </div>

      {/* Edit Panel */}
      {isEditing && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <ClipboardDocumentListIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Form Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form Action
              </label>
              <input
                type="url"
                value={content.action}
                onChange={(e) => handleActionChange(e.target.value)}
                placeholder="https://example.com/submit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                value={content.method}
                onChange={(e) => handleMethodChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submit Button Text
            </label>
            <input
              type="text"
              value={content.submitText}
              onChange={(e) => handleSubmitTextChange(e.target.value)}
              placeholder="Submit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Form Fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Form Fields</h4>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleAddField("text")}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Text
                </button>
                <button
                  onClick={() => handleAddField("email")}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Email
                </button>
                <button
                  onClick={() => handleAddField("textarea")}
                  className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                >
                  Textarea
                </button>
                <button
                  onClick={() => handleAddField("select")}
                  className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                >
                  Select
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {content.fields.map((field) => (
                <div
                  key={field.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(field.id, { label: e.target.value })
                      }
                      placeholder="Field label"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        handleFieldChange(field.id, { name: e.target.value })
                      }
                      placeholder="Field name"
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleFieldChange(field.id, {
                          type: e.target.value as any,
                        })
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="password">Password</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            handleFieldChange(field.id, {
                              required: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Required
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-primary flex-1"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBlock;
