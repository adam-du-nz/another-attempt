import * as designTokens from "@myob/design-tokens/dist/design-tokens/js/es6/design-tokens";
import { style } from "treat";

const border = {
  base: {
    borderColor: designTokens.flxPaletteStorm17
  },
  active: {
    borderColor: designTokens.flxPaletteDusk100
  },
  droppable: {
    borderStyle: "solid"
  }
};
const background = {
  base: {
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: 1,
    maxWidth: "400px",
    transition: "border .24s ease-in-out"
  }
};
const borderBoxProps = {
  position: "relative",
  padding: designTokens.flxSpacingLarge,
  borderWidth: designTokens.flxSizeBorderThick,
  borderRadius: designTokens.flxSizeBorderRadiusMedium,
  opacity: 1,
  borderStyle: "dashed"
};

const containerBoxProps = {
  textAlign: "center",
  marginLeft: "auto",
  marginRight: "auto"
};

const fileBrowserProps = {};

const linkProps = {
  cursor: "pointer",
  color: designTokens.flxColorLink
};

export const dropzone = style({ ...background.base });

export const dropzoneBorder = style({ ...border.base, ...borderBoxProps });

export const dropzoneBorderActive = style({
  ...border.active,
  ...borderBoxProps
});

export const dropzoneContainer = style({ ...containerBoxProps });

export const fileBrowser = style({ ...fileBrowserProps });

export const fileBrowserLabelText = style({});

export const fileBrowserHyperText = style({ ...linkProps });
