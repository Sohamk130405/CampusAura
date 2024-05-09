import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Divider,
  Button,
  CardFooter,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
const ContentCard = ({ heading, img, link, btnText, color }) => {
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.dark");

  return (
    <Card maxW={"190px"} shadow={"lg"} h={"350px"} bg={bgColor}>
      <CardBody>
        <Image
          src={img}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{heading}</Heading>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button variant="solid" colorScheme={color} w={"full"}>
          <a href={link}>{btnText}</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
