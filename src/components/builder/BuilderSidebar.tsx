import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { BlockType, getBlockDisplayName } from "../../utils/blockUtils";
import {
  DocumentTextIcon,
  PhotoIcon,
  CursorArrowRaysIcon,
  RectangleStackIcon,
  ClipboardDocumentListIcon,
  MinusIcon,
  CreditCardIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

interface DraggableBlockProps {
  blockType: BlockType;
  icon: React.ReactNode;
  name: string;
  category: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  blockType,
  icon,
  name,
  category,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `block-${blockType}`,
      data: {
        type: "block",
        blockType,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`block-item ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">{category}</p>
        </div>
      </div>
    </div>
  );
};

const BuilderSidebar: React.FC = () => {
  const blocks: { type: BlockType; icon: React.ReactNode; category: string }[] =
    [
      {
        type: "text",
        icon: <DocumentTextIcon className="w-5 h-5 text-gray-600" />,
        category: "Content",
      },
      {
        type: "image",
        icon: <PhotoIcon className="w-5 h-5 text-gray-600" />,
        category: "Media",
      },
      {
        type: "button",
        icon: <CursorArrowRaysIcon className="w-5 h-5 text-gray-600" />,
        category: "Interactive",
      },
      {
        type: "container",
        icon: <RectangleStackIcon className="w-5 h-5 text-gray-600" />,
        category: "Layout",
      },
      {
        type: "form",
        icon: <ClipboardDocumentListIcon className="w-5 h-5 text-gray-600" />,
        category: "Interactive",
      },
      {
        type: "divider",
        icon: <MinusIcon className="w-5 h-5 text-gray-600" />,
        category: "Layout",
      },
      {
        type: "card",
        icon: <CreditCardIcon className="w-5 h-5 text-gray-600" />,
        category: "Content",
      },
      {
        type: "list",
        icon: <ListBulletIcon className="w-5 h-5 text-gray-600" />,
        category: "Content",
      },
    ];

  // Group blocks by category
  const blocksByCategory = blocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, typeof blocks>);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Blocks</h2>
        <p className="text-sm text-gray-500">Drag blocks to the canvas</p>
      </div>

      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(blocksByCategory).map(([category, categoryBlocks]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {categoryBlocks.map((block) => (
                <DraggableBlock
                  key={block.type}
                  blockType={block.type}
                  icon={block.icon}
                  name={getBlockDisplayName(block.type)}
                  category={category}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>💡 Tip: Drag blocks to the canvas to add them to your page</p>
        </div>
      </div>
    </div>
  );
};

export default BuilderSidebar;
