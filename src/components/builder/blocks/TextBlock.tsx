import React, { useState, useRef, useEffect } from "react";
import { Block, TextBlockContent } from "../../../types";
import { useBuilder } from "../../../contexts/BuilderContext";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Bars3Icon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3CenterLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface TextBlockProps {
  block: Block;
  isPreview?: boolean;
}

const TextBlock: React.FC<TextBlockProps> = ({ block, isPreview = false }) => {
  const { updateBlock, deleteBlock } = useBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const content = block.content as TextBlockContent;
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditContent(content.text);
  }, [content.text]);

  const handleTextChange = (newText: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        text: newText,
      },
    });
  };

  const handleTagChange = (newTag: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        tag: newTag as any,
      },
    });
  };

  const handleAlignmentChange = (newAlignment: string) => {
    updateBlock(block.id, {
      content: {
        ...content,
        alignment: newAlignment as any,
      },
    });
  };

  const handleRemoveBlock = () => {
    if (window.confirm('Are you sure you want to remove this text block?')) {
      deleteBlock(block.id);
    }
  };

  const handleFormattingChange = (
    format: "bold" | "italic" | "underline",
    value: boolean
  ) => {
    updateBlock(block.id, {
      content: {
        ...content,
        formatting: {
          ...content.formatting,
          [format]: value,
        },
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && content.tag !== "p") {
      e.preventDefault();
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(content.text);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editContent !== content.text) {
      handleTextChange(editContent);
    }
  };

  const renderText = () => {
    const style: React.CSSProperties = {
      textAlign: content.alignment,
      fontWeight: content.formatting.bold ? "bold" : "normal",
      fontStyle: content.formatting.italic ? "italic" : "normal",
      textDecoration: content.formatting.underline ? "underline" : "none",
    };

    if (isPreview) {
      switch (content.tag) {
        case "h1":
          return <h1 style={style}>{content.text}</h1>;
        case "h2":
          return <h2 style={style}>{content.text}</h2>;
        case "h3":
          return <h3 style={style}>{content.text}</h3>;
        case "h4":
          return <h4 style={style}>{content.text}</h4>;
        case "h5":
          return <h5 style={style}>{content.text}</h5>;
        case "h6":
          return <h6 style={style}>{content.text}</h6>;
        case "span":
          return <span style={style}>{content.text}</span>;
        default:
          return <p style={style}>{content.text}</p>;
      }
    }

    if (isEditing) {
      const TagComponent =
        content.tag === "h1"
          ? "h1"
          : content.tag === "h2"
          ? "h2"
          : content.tag === "h3"
          ? "h3"
          : content.tag === "h4"
          ? "h4"
          : content.tag === "h5"
          ? "h5"
          : content.tag === "h6"
          ? "h6"
          : content.tag === "span"
          ? "span"
          : "p";

      return (
        <TagComponent style={style}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full resize-none border-none outline-none bg-transparent"
            autoFocus
            style={{
              minHeight: content.tag.startsWith("h") ? "2rem" : "1.5rem",
            }}
          />
        </TagComponent>
      );
    }

    const TagComponent =
      content.tag === "h1"
        ? "h1"
        : content.tag === "h2"
        ? "h2"
        : content.tag === "h3"
        ? "h3"
        : content.tag === "h4"
        ? "h4"
        : content.tag === "h5"
        ? "h5"
        : content.tag === "h6"
        ? "h6"
        : content.tag === "span"
        ? "span"
        : "p";

    return (
      <div
        ref={textRef}
        onClick={() => setIsEditing(true)}
        className="cursor-text hover:bg-gray-100 rounded px-1 py-0.5 -mx-1 -my-0.5"
      >
        <TagComponent style={style}>
          {content.text || "Click to edit text"}
        </TagComponent>
      </div>
    );
  };

  if (isPreview) {
    return <>{renderText()}</>;
  }

  return (
    <div className="relative group">
      {/* Block Controls */}
      <div className="absolute -top-12 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-1 z-50">
        {/* Tag selector */}
        <select
          value={content.tag}
          onChange={(e) => handleTagChange(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
          <option value="p">Paragraph</option>
          <option value="span">Span</option>
        </select>

        {/* Formatting buttons */}
        <button
          onClick={() =>
            handleFormattingChange("bold", !content.formatting.bold)
          }
          className={`p-1 rounded ${
            content.formatting.bold ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            handleFormattingChange("italic", !content.formatting.italic)
          }
          className={`p-1 rounded ${
            content.formatting.italic ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Italic"
        >
          <ItalicIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            handleFormattingChange("underline", !content.formatting.underline)
          }
          className={`p-1 rounded ${
            content.formatting.underline ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        {/* Alignment buttons */}
        <div className="flex border border-gray-300 rounded">
          <button
            onClick={() => handleAlignmentChange("left")}
            className={`p-1 ${
              content.alignment === "left" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            title="Align Left"
          >
            <Bars3BottomLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignmentChange("center")}
            className={`p-1 ${
              content.alignment === "center"
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
            title="Align Center"
          >
            <Bars3CenterLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignmentChange("right")}
            className={`p-1 ${
              content.alignment === "right"
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
            title="Align Right"
          >
            <Bars3BottomRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignmentChange("justify")}
            className={`p-1 ${
              content.alignment === "justify"
                ? "bg-gray-200"
                : "hover:bg-gray-100"
            }`}
            title="Justify"
          >
            <Bars3Icon className="w-4 h-4" />
          </button>
        </div>

        {/* Edit and Remove buttons */}
        <div className="flex items-center space-x-1 border-l border-gray-300 pl-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
          >
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
      </div>

      {/* Text Content */}
      <div className="min-h-[2rem]">{renderText()}</div>
    </div>
  );
};

export default TextBlock;
