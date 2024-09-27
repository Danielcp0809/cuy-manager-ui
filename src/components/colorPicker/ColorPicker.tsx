import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { HexColorPicker } from "react-colorful";
import { IoIosColorPalette } from "react-icons/io";

interface ColorPickerProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  icon?: React.ReactNode;
  [x: string]: any;
}

function ColorPicker(props: ColorPickerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { value, setValue, label, icon, ...rest } = props;
  const firstFieldRef = React.useRef(null);
  return (
    <FormControl mt={4}>
      <FormLabel>{label ?? "Color"}</FormLabel>
      <Box display="flex" gap="5px">
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement="auto"
        >
          <PopoverAnchor>
            <InputGroup>
              <Input
                onChange={(event) => setValue(event.target.value)}
                value={value}
                placeholder="#000000"
                {...rest}
              />
              <InputRightElement>
                <Box bg={value} h="35px" minW="35px" borderRadius="8px" />
              </InputRightElement>
            </InputGroup>
          </PopoverAnchor>
          <PopoverTrigger>
            {icon ? (
              icon
            ) : (
              <IconButton
                size="md"
                icon={<IoIosColorPalette />}
                aria-label="color-picker"
              />
            )}
          </PopoverTrigger>
          <PopoverContent p={6} width="fit-content">
            <PopoverCloseButton />
            <PopoverBody>
              <HexColorPicker color={value} onChange={setValue} />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </FormControl>
  );
}

export default ColorPicker;
