//
// cribbed from https://codesandbox.io/s/chakra-slatejs-ptpfm?file=/src/index.tsx
//
import {
    IconButton,
    HStack,
    useColorMode,
    chakra,
    ListItem,
    OrderedList,
    UnorderedList,
    Heading,
} from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import { FiCode, FiBold, FiItalic, FiList, FiUnderline } from 'react-icons/fi'
import {
    MdLooksOne,
    MdLooksTwo,
    MdFormatListNumbered,
    MdFormatQuote,
} from 'react-icons/md'
import {
    useSlate,
    ReactEditor,
    RenderLeafProps,
    RenderElementProps,
} from 'slate-react'
import { Editor, Transforms, Element as SlateElement } from 'slate'
import { HistoryEditor } from 'slate-history'

type EditorProps = Editor | ReactEditor | HistoryEditor
const LIST_TYPES = ['numbered-list', 'bulleted-list']

const isBlockActive = (editor: EditorProps, format: string) => {
    const nodeGen = Editor.nodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            (n as any).type === format,
    })

    let node = nodeGen.next()
    while (!node.done) {
        return true
    }
    return false
}

const isMarkActive = (editor: EditorProps, format: string) => {
    const marks = Editor.marks(editor)
    return marks ? (marks as any)[format] === true : false
}

export const toggleBlock = (editor: EditorProps, format: string) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            LIST_TYPES.includes(
                (!Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as any).type) as string
            ),
        split: true,
    })
    const newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes(editor, newProperties as Partial<SlateElement>)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

export const toggleMark = (editor: EditorProps, format: string) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

export const MarkButton = ({
    format,
    icon,
}: {
    format: string
    icon: ReactElement
}) => {
    const editor = useSlate()
    return (
        <IconButton
            variant="outline"
            colorScheme="green"
            isActive={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
            aria-label={format}
            icon={icon}
            borderWidth={0}
            fontSize={'20px'}
        />
    )
}

export const BlockButton = ({
    format,
    icon,
}: {
    format: string
    icon: ReactElement
}) => {
    const editor = useSlate()
    return (
        <IconButton
            variant="outline"
            colorScheme="green"
            isActive={isBlockActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
            aria-label={format}
            icon={icon}
            borderWidth={0}
            fontSize={'20px'}
        />
    )
}

export const Toolbar = () => {
    return (
        <HStack
            borderWidth={'0 0 1px 0'}
            padding={'10px 5px'}
            spacing={'5px'}
            wrap={'wrap'}
        >
            <MarkButton format="bold" icon={<FiBold />} />
            <MarkButton format="italic" icon={<FiItalic />} />
            <MarkButton format="underline" icon={<FiUnderline />} />
            <MarkButton format="code" icon={<FiCode />} />
            <BlockButton format="heading-one" icon={<MdLooksOne />} />
            <BlockButton format="heading-two" icon={<MdLooksTwo />} />
            <BlockButton format="block-quote" icon={<MdFormatQuote />} />
            <BlockButton
                format="numbered-list"
                icon={<MdFormatListNumbered />}
            />
            <BlockButton format="bulleted-list" icon={<FiList />} />
        </HStack>
    )
}

const BlockquoteStyle: React.CSSProperties | undefined = {
    margin: '1.5em 10px',
    padding: '0.5em 10px',
}

export const Element = ({
    attributes,
    children,
    element,
}: RenderElementProps) => {
    interface ElementFormat {
        text: string
        type: string
    }
    let elementFormat: ElementFormat = element as any

    switch (elementFormat.type) {
        case 'block-quote':
            return (
                <chakra.blockquote
                    style={BlockquoteStyle}
                    borderLeftWidth={'10px'}
                    borderLeftColor={'gray.200'}
                    {...attributes}
                >
                    {children}
                </chakra.blockquote>
            )
        case 'list-item':
            return <ListItem {...attributes}>{children}</ListItem>
        case 'numbered-list':
            return <OrderedList {...attributes}>{children}</OrderedList>
        case 'bulleted-list':
            return <UnorderedList {...attributes}>{children}</UnorderedList>
        case 'heading-one':
            return (
                <Heading as="h1" size="3xl" {...attributes}>
                    {children}
                </Heading>
            )
        case 'heading-two':
            return (
                <Heading as="h2" size="2xl" {...attributes}>
                    {children}
                </Heading>
            )
        default:
            return <p {...attributes}>{children}</p>
    }
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    const { colorMode, toggleColorMode } = useColorMode()

    interface RenderLeafFormat {
        bold: boolean
        code: boolean
        italic: boolean
        underline: boolean
        text: string
    }
    let leafFormat: RenderLeafFormat = leaf as any

    if (leafFormat.bold) {
        children = <strong>{children}</strong>
    }

    if (leafFormat.code) {
        children = (
            <chakra.code
                padding={'3px'}
                backgroundColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                fontSize={'90%'}
            >
                {children}
            </chakra.code>
        )
    }

    if (leafFormat.italic) {
        children = <em>{children}</em>
    }

    if (leafFormat.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}
