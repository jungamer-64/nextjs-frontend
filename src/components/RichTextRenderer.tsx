// src/components/RichTextRenderer.tsx
import React from 'react';

// Linkコンポーネントをインポートして、Next.jsの高速なページ遷移を活かします
import Link from 'next/link';
import type { RTNode, RTContent } from '@/types';

const renderNode = (node: RTNode, index: number, headingOffset = 0): React.ReactNode => {
  // 1. node.typeが 'link' の場合の処理を追加
  if (node.type === 'link') {
  const url = node.fields?.url ?? '';
  const isExternal = typeof url === 'string' && url.startsWith('http');
    return (
      <Link
        href={url}
        key={index}
        className="text-blue-500 hover:underline"
        {...(isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      >
  {(node.children ?? []).map((child: RTNode, i: number) => renderNode(child, i, headingOffset))}
      </Link>
    );
  }

  if (node.type === 'heading') {
    // Shift heading level by headingOffset so CMS content doesn't use h1 where page already has one
    const originalLevel = Number(String(node.tag).replace(/^h/, '')) || 1;
    const level = Math.min(6, originalLevel + headingOffset);
    const tagName = `h${level}`;

    const sizeClass =
      level === 1 ? 'text-4xl' :
      level === 2 ? 'text-3xl' :
      level === 3 ? 'text-2xl' :
      level === 4 ? 'text-xl' :
      'text-lg';

    const marginClass = level <= 2 ? 'my-6' : level === 3 ? 'my-5' : level === 4 ? 'my-4' : 'my-3';

    return React.createElement(
      tagName,
      { key: index, className: `${sizeClass} font-bold ${marginClass}` },
  (node.children ?? []).map((child: RTNode, i: number) => renderNode(child, i, headingOffset))
    );
  }

  if (node.type === 'paragraph') {
  return <p key={index} className="mb-4">{(node.children ?? []).map((child: RTNode, i: number) => renderNode(child, i, headingOffset))}</p>;
  }

  if (node.type === 'list') {
    const Tag = node.ordered ? 'ol' : 'ul';
    return (
      <Tag key={index} className="mb-4 list-inside list-disc">
        {(node.children ?? []).map((child: RTNode, i: number) => (
          <li key={i}>{renderNode(child, i, headingOffset)}</li>
        ))}
      </Tag>
    );
  }

  if (node.type === 'listItem') {
    return <li key={index}>{(node.children ?? []).map((child: RTNode, i: number) => renderNode(child, i, headingOffset))}</li>;
  }

  // 2. node.typeが 'text' の場合の処理を強化
  if (node.type === 'text') {
    let textElement: React.ReactNode = node.text;
    
    // formatの値をチェックして、複数のスタイルを適用できるようにします
    const fmt = node.format ?? 0;
    if (fmt & 1) { // Bold (1)
      textElement = <strong key={`${index}-bold`}>{textElement}</strong>;
    }
    if (fmt & 2) { // Italic (2)
      textElement = <em key={`${index}-italic`}>{textElement}</em>;
    }
    if (fmt & 8) { // Underline (8)
      textElement = <u key={`${index}-underline`}>{textElement}</u>;
    }
    
    return textElement;
  }

  return null;
};

const RichTextRenderer = ({ content, headingOffset = 0 }: { content?: RTContent; headingOffset?: number }) => {
  const nodes = content?.root?.children ?? [];
  if (nodes.length === 0) return null;
  return <>{nodes.map((node: RTNode, index: number) => renderNode(node, index, headingOffset))}</>;
};

export default RichTextRenderer;