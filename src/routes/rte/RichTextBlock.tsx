import React, { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { Editor, Transforms, createEditor, Node, Text } from "slate";
import { withHistory } from "slate-history";
import { Box } from "@chakra-ui/react";
import { toggleMark, Toolbar } from "./RichTextSubComponents";
import escapeHtml from "escape-html";
import { jsx } from "slate-hyperscript";
import { observer } from "mobx-react";

// @refresh reset
const HOTKEYS: { [hotkey: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

export interface RichTextBlockProps {
  initialValue?: any;
  readOnly: any;
  updateCurrent: any;
  renderDependencies?: any[];
}

export const serialize = (node: any) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if ((node as any).bold) {
      string = `<strong>${string}</strong>`;
    }
    return string;
  }

  const children = node.children.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "block-quote":
      return `<blockquote class="blockquote"><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    default:
      return children;
  }
};

export const RichTextBlock: React.FC<RichTextBlockProps> = observer(
  ({ initialValue, readOnly, updateCurrent, renderDependencies }) => {
    const defaultInitialValue = [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];

    initialValue = initialValue ? initialValue : defaultInitialValue;
    const [value, setValue] = useState<Node[]>(initialValue);
    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(
      () => withHistory(withReact<ReactEditor>(createEditor() as ReactEditor)),
      []
    );
    renderDependencies =
      typeof renderDependencies === "undefined" ? [] : renderDependencies;
    useEffect(() => {
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
      Transforms.insertNodes(editor, initialValue);
      console.log("inserting Data", initialValue);
    }, [...renderDependencies]);

    //focus selection
    const [focused, setFocused] = React.useState(false);
    const savedSelection = React.useRef(editor.selection);

    const onFocus = React.useCallback(() => {
      setFocused(true);
      if (!editor.selection && value?.length) {
        Transforms.select(
          editor,
          savedSelection.current ?? Editor.end(editor, [])
        );
      }
    }, [editor]);

    const onBlur = React.useCallback(() => {
      setFocused(false);
      savedSelection.current = editor.selection;
    }, [editor]);

    const divRef = React.useRef<HTMLDivElement>(null);

    const focusEditor = React.useCallback(
      (e: React.MouseEvent) => {
        if (e.target === divRef.current) {
          ReactEditor.focus(editor);
          e.preventDefault();
        }
      },
      [editor]
    );

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event as any)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
        }
      }
    };

    const style = readOnly
      ? { maxHeight: "200px", overflow: "auto" }
      : { minHeight: "150px", resize: "vertical", overflow: "auto" };

    return (
      <Box ref={divRef} onMouseDown={focusEditor} borderWidth={"1px"}>
        <Slate
          editor={editor}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            updateCurrent(newValue);
          }}
        >
          {readOnly ? <></> : <Toolbar />}
          <Box padding={"15px 5px"}>
            <Editable
              readOnly={readOnly}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={readOnly ? "" : "Enter some rich text…"}
              spellCheck
              style={{
                minHeight: "150px",
                resize: "vertical",
                overflow: "auto",
              }}
            />
          </Box>
        </Slate>
      </Box>
    );
  }
);

const ELEMENT_TAGS = {
  A: (el) => ({ type: "link", url: el.getAttribute("href") }),
  BLOCKQUOTE: () => ({ type: "quote" }),
  H1: () => ({ type: "heading-one" }),
  H2: () => ({ type: "heading-two" }),
  H3: () => ({ type: "heading-three" }),
  H4: () => ({ type: "heading-four" }),
  H5: () => ({ type: "heading-five" }),
  H6: () => ({ type: "heading-six" }),
  IMG: (el) => ({ type: "image", url: el.getAttribute("src") }),
  LI: () => ({ type: "list-item" }),
  OL: () => ({ type: "numbered-list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bulleted-list" }),
};

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const deserialize = (el) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === "BR") {
    return "\n";
  }

  const { nodeName } = el;
  let parent = el;

  if (
    nodeName === "PRE" &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === "CODE"
  ) {
    parent = el.childNodes[0];
  }
  let children = Array.from(parent.childNodes).map(deserialize).flat();

  if (children.length === 0) {
    children = [{ text: "" }];
  }

  if (el.nodeName === "BODY") {
    return jsx("fragment", {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx("element", attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map((child) => jsx("text", attrs, child));
  }

  return children;
};

const withHtml = (editor) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData("text/html");

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

const Element = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    default:
      return <p {...attributes}>{children}</p>;
    case "quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "code":
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "heading-five":
      return <h5 {...attributes}>{children}</h5>;
    case "heading-six":
      return <h6 {...attributes}>{children}</h6>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "link":
      return (
        <a href={element.url} {...attributes}>
          {children}
        </a>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  return <span {...attributes}>{children}</span>;
};
