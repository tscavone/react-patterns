import { Box } from "@chakra-ui/react";
import { RichTextBlock, serialize, deserialize } from "./rte/RichTextBlock";
export const RichTextEdit = () => {
  const updateCurrentNote = () => {};
  const getDeserialized = () => {
    let currentNote: any = {};
    //    currentNote.text = "<p>Hello world</p>";
    currentNote.text = "";

    console.log("before deserialized: ", currentNote.text);
    var parser = new DOMParser();
    var el = parser.parseFromString(currentNote.text, "text/html");
    let deserialized = deserialize(el.body);

    console.log("after deserialized: ", currentNote.text);
    return deserialized;
  };
  return (
    <Box w={[250, 500, 750]}>
      <RichTextBlock
        initialValue={getDeserialized()}
        readOnly={false}
        updateCurrent={updateCurrentNote}
      />
    </Box>
  );
};
