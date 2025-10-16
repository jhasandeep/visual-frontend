import React from "react";
import { Block } from "../../types";
import { applyBlockStyles, getBlockChildren } from "../../utils/blockUtils";
import TextBlock from "./blocks/TextBlock";
import ImageBlock from "./blocks/ImageBlock";
import ButtonBlock from "./blocks/ButtonBlock";
import ContainerBlock from "./blocks/ContainerBlock";
import FormBlock from "./blocks/FormBlock";
import DividerBlock from "./blocks/DividerBlock";
import CardBlock from "./blocks/CardBlock";
import ListBlock from "./blocks/ListBlock";

interface BlockRendererProps {
  block: Block;
  isPreview?: boolean;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isPreview = false,
}) => {
  const styles = applyBlockStyles(block.styles);
  const children = getBlockChildren([block], block.id);

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return <TextBlock block={block} isPreview={isPreview} />;
      case "image":
        return <ImageBlock block={block} isPreview={isPreview} />;
      case "button":
        return <ButtonBlock block={block} isPreview={isPreview} />;
      case "container":
        return <ContainerBlock block={block} isPreview={isPreview} />;
      case "form":
        return <FormBlock block={block} isPreview={isPreview} />;
      case "divider":
        return <DividerBlock block={block} isPreview={isPreview} />;
      case "card":
        return <CardBlock block={block} isPreview={isPreview} />;
      case "list":
        return <ListBlock block={block} isPreview={isPreview} />;
      default:
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            Unknown block type: {block.type}
          </div>
        );
    }
  };

  return (
    <div
      style={styles}
      className={`block-wrapper ${isPreview ? "preview-mode" : "edit-mode"}`}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {renderBlockContent()}

      {/* Render children blocks */}
      {children.length > 0 && (
        <div className="block-children">
          {children
            .sort((a, b) => a.order - b.order)
            .map((childBlock) => (
              <BlockRenderer
                key={childBlock.id}
                block={childBlock}
                isPreview={isPreview}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default BlockRenderer;

