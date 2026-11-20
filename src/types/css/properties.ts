// This file is managed by the generate-types script.

import type { AuthorValue } from './values.ts';

type Value = AuthorValue | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset';

type AlignContent = 'baseline' | 'center' | 'end' | 'first' | 'flex-end' | 'flex-start' | 'flow-end' | 'flow-start' | 'last' | 'normal' | 'safe' | 'start' | 'stretch' | 'unsafe' | Value;
type AlignContent2 = 'space-around' | 'space-between' | 'space-evenly' | Value;
type AlignSelf = 'baseline' | 'center' | 'end' | 'first' | 'flex-end' | 'flex-start' | 'flow-end' | 'flow-start' | 'last' | 'normal' | 'safe' | 'self-end' | 'self-start' | 'start' | 'stretch' | 'unsafe' | Value;
type AnchorScope = 'all' | 'none' | Value;
type Animation = 'alternate' | 'alternate-reverse' | 'auto' | 'backwards' | 'both' | 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'forwards' | 'infinite' | 'linear' | 'none' | 'normal' | 'paused' | 'reverse' | 'running' | 'step-end' | 'step-start' | Value;
type AnimationDirection = 'alternate' | 'alternate-reverse' | 'normal' | 'reverse' | Value;
type AnimationFillMode = 'backwards' | 'both' | 'forwards' | 'none' | Value;
type AnimationIterationCount = 'infinite' | Value;
type AnimationPlayState = 'paused' | 'running' | Value;
type AnimationTimingFunction = 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear' | 'step-end' | 'step-start' | Value;
type Appearance = 'auto' | 'base' | 'base-select' | 'button' | 'checkbox' | 'listbox' | 'menulist' | 'menulist-button' | 'meter' | 'none' | 'progress-bar' | 'radio' | 'searchfield' | 'textarea' | 'textfield' | Value;
type BackfaceVisibility = 'hidden' | 'visible' | Value;
type Background = 'auto' | 'block-end' | 'block-start' | 'border-area' | 'border-box' | 'bottom' | 'center' | 'contain' | 'content-box' | 'cover' | 'end' | 'fixed' | 'inline-end' | 'inline-start' | 'left' | 'local' | 'no-repeat' | 'none' | 'padding-box' | 'repeat' | 'repeat-block' | 'repeat-inline' | 'repeat-x' | 'repeat-y' | 'right' | 'round' | 'scroll' | 'space' | 'start' | 'text' | 'top' | 'x-end' | 'x-start' | 'y-end' | 'y-start' | Value;
type BackgroundOrigin = 'border-box' | 'content-box' | 'padding-box' | Value;
type BackgroundRepeatX = 'repeat' | 'round' | 'space' | Value;
type BackgroundRepeatX2 = 'no-repeat' | Value;
type BlockStepAlign = 'center' | 'end' | 'start' | Value;
type Border = 'dashed' | 'dotted' | 'double' | 'groove' | 'hairline' | 'hidden' | 'inset' | 'medium' | 'none' | 'outset' | 'ridge' | 'solid' | 'thick' | 'thin' | Value;
type BorderTopStyle = 'hidden' | Value;
type BoxSizing = 'border-box' | 'content-box' | Value;
type BreakAfter = 'all' | 'always' | 'auto' | 'avoid' | 'avoid-column' | 'avoid-page' | 'avoid-region' | 'column' | 'left' | 'page' | 'recto' | 'region' | 'right' | 'verso' | Value;
type Clear = 'block-end' | 'block-start' | 'bottom' | 'inline-end' | 'inline-start' | 'left' | 'none' | 'right' | 'top' | Value;
type ClipPath = 'border-box' | 'content-box' | 'fill-box' | 'none' | 'padding-box' | 'stroke-box' | 'view-box' | Value;
type ClipPath2 = 'half-border-box' | 'margin-box' | Value;
type ClipRule = 'evenodd' | 'nonzero' | Value;
type Color = 'AccentColor' | 'AccentColorText' | 'ActiveBorder' | 'ActiveCaption' | 'ActiveText' | 'AppWorkspace' | 'Background' | 'ButtonBorder' | 'ButtonFace' | 'ButtonHighlight' | 'ButtonShadow' | 'ButtonText' | 'Canvas' | 'CanvasText' | 'CaptionText' | 'Field' | 'FieldText' | 'GrayText' | 'Highlight' | 'HighlightText' | 'InactiveBorder' | 'InactiveCaption' | 'InactiveCaptionText' | 'InfoBackground' | 'InfoText' | 'LinkText' | 'Mark' | 'MarkText' | 'Menu' | 'MenuText' | 'Scrollbar' | 'SelectedItem' | 'SelectedItemText' | 'ThreeDDarkShadow' | 'ThreeDFace' | 'ThreeDHighlight' | 'ThreeDLightShadow' | 'ThreeDShadow' | 'VisitedText' | 'Window' | 'WindowFrame' | 'WindowText' | 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'black' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'currentColor' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'transparent' | 'turquoise' | 'violet' | 'wheat' | 'white' | 'whitesmoke' | 'yellow' | 'yellowgreen' | Value;
type ColorInterpolation = 'auto' | 'linearRGB' | 'sRGB' | Value;
type ColorScheme = 'dark' | 'light' | 'normal' | Value;
type ColumnSpan = 'all' | 'auto' | 'none' | Value;
type Content = 'circle' | 'close-quote' | 'contents' | 'disc' | 'disclosure-closed' | 'disclosure-open' | 'no-close-quote' | 'no-open-quote' | 'open-quote' | 'square' | Value;
type CopyInto = 'content' | 'element' | 'none' | Value;
type CornerEndEndShape = 'bevel' | 'notch' | 'round' | 'scoop' | 'square' | 'squircle' | Value;
type D = 'none' | Value;
type DominantBaseline = 'alphabetic' | 'central' | 'hanging' | 'ideographic' | 'mathematical' | 'middle' | 'text-bottom' | 'text-top' | Value;
type Fill = 'child' | 'none' | Value;
type FillBreak = 'bounding-box' | 'clone' | 'slice' | Value;
type FillOrigin = 'border-box' | 'content-box' | 'fill-box' | 'padding-box' | 'stroke-box' | Value;
type FillOrigin2 = 'match-parent' | Value;
type FillPosition = 'block-end' | 'block-start' | 'bottom' | 'center' | 'end' | 'inline-end' | 'inline-start' | 'left' | 'right' | 'start' | 'top' | 'x-end' | 'x-start' | 'y-end' | 'y-start' | Value;
type FillRepeat = 'no-repeat' | 'repeat' | 'repeat-block' | 'repeat-inline' | 'repeat-x' | 'repeat-y' | 'round' | 'space' | Value;
type FillSize = 'auto' | 'contain' | 'cover' | Value;
type FlexBasis = 'content' | Value;
type FlexDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse' | Value;
type FlexWrap = 'balance' | 'nowrap' | 'wrap' | 'wrap-reverse' | Value;
type FontKerning = 'auto' | 'none' | 'normal' | Value;
type FontWidth = 'condensed' | 'expanded' | 'extra-condensed' | 'extra-expanded' | 'normal' | 'semi-condensed' | 'semi-expanded' | 'ultra-condensed' | 'ultra-expanded' | Value;
type GridAutoRows = 'auto' | 'max-content' | 'min-content' | Value;
type GridRow = 'auto' | 'span' | Value;
type GridTemplateRows = 'auto' | 'auto-fill' | 'auto-fit' | 'max-content' | 'min-content' | 'none' | 'subgrid' | Value;
type JustifyContent = 'center' | 'end' | 'flex-end' | 'flex-start' | 'flow-end' | 'flow-start' | 'normal' | 'safe' | 'space-around' | 'space-between' | 'space-evenly' | 'start' | 'stretch' | 'unsafe' | Value;
type JustifyContent2 = 'left' | 'right' | Value;
type LineFitEdge = 'alphabetic' | 'cap' | 'ex' | 'ideographic' | 'ideographic-ink' | 'text' | Value;
type Mask = 'add' | 'alpha' | 'auto' | 'block-end' | 'block-start' | 'border-box' | 'bottom' | 'center' | 'contain' | 'content-box' | 'cover' | 'end' | 'exclude' | 'fill-box' | 'half-border-box' | 'inline-end' | 'inline-start' | 'intersect' | 'left' | 'luminance' | 'margin-box' | 'match-source' | 'no-clip' | 'no-repeat' | 'none' | 'padding-box' | 'repeat' | 'repeat-block' | 'repeat-inline' | 'repeat-x' | 'repeat-y' | 'right' | 'round' | 'space' | 'start' | 'stroke-box' | 'subtract' | 'top' | 'view-box' | 'x-end' | 'x-start' | 'y-end' | 'y-start' | Value;
type MaskClip = 'border-box' | 'content-box' | 'fill-box' | 'padding-box' | 'stroke-box' | 'view-box' | Value;
type MaskClip2 = 'no-clip' | Value;
type MaskComposite = 'add' | 'exclude' | 'intersect' | 'subtract' | Value;
type MaskType = 'alpha' | 'luminance' | Value;
type MathShift = 'compact' | 'normal' | Value;
type MaxWidth = 'none' | Value;
type NavUp = 'auto' | 'current' | 'root' | Value;
type OutlineStyle = 'dashed' | 'dotted' | 'double' | 'groove' | 'inset' | 'none' | 'outset' | 'ridge' | 'solid' | Value;
type OverflowX = 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible' | Value;
type Overlay = 'auto' | 'none' | Value;
type OverscrollBehavior = 'auto' | 'chain' | 'contain' | 'none' | Value;
type PageBreakAfter = 'always' | 'auto' | 'avoid' | 'left' | 'right' | Value;
type PositionArea = 'block-end' | 'block-start' | 'bottom' | 'center' | 'end' | 'inline-end' | 'inline-start' | 'left' | 'none' | 'right' | 'self-block-end' | 'self-block-start' | 'self-end' | 'self-inline-end' | 'self-inline-start' | 'self-start' | 'self-x-end' | 'self-x-start' | 'self-y-end' | 'self-y-start' | 'span-all' | 'span-block-end' | 'span-block-start' | 'span-bottom' | 'span-end' | 'span-inline-end' | 'span-inline-start' | 'span-left' | 'span-right' | 'span-self-block-end' | 'span-self-block-start' | 'span-self-end' | 'span-self-inline-end' | 'span-self-inline-start' | 'span-self-start' | 'span-self-x-end' | 'span-self-x-start' | 'span-self-y-end' | 'span-self-y-start' | 'span-start' | 'span-top' | 'span-x-end' | 'span-x-start' | 'span-y-end' | 'span-y-start' | 'start' | 'top' | 'x-end' | 'x-start' | 'y-end' | 'y-start' | Value;
type RestAfter = 'medium' | 'none' | 'strong' | 'weak' | 'x-strong' | 'x-weak' | Value;
type RowGap = 'hairline' | 'medium' | 'thick' | 'thin' | Value;
type RowGap2 = 'normal' | Value;
type RowRule = 'auto' | Value;
type RowRuleBreak = 'intersection' | 'none' | 'normal' | Value;
type RowRuleInsetCap = 'overlap-join' | Value;
type RowRuleStyle = 'auto' | 'hidden' | Value;
type RowRuleVisibilityItems = 'all' | 'around' | 'between' | 'normal' | Value;
type RowRuleWidth = 'auto' | 'hairline' | 'medium' | 'thick' | 'thin' | Value;
type Rx = 'auto' | Value;
type StrokeDashadjust = 'compress' | 'dashes' | 'gaps' | 'none' | 'stretch' | Value;
type TextAlign = 'center' | 'end' | 'justify' | 'left' | 'match-parent' | 'right' | 'start' | Value;
type TextBox = 'normal' | Value;
type TextRendering = 'auto' | 'geometricPrecision' | 'optimizeSpeed' | Value;
type TimelineTriggerActiveRangeEnd = 'auto' | 'normal' | Value;
type TransformOrigin = 'bottom' | 'center' | 'left' | 'right' | 'top' | Value;
type TransformStyle = 'flat' | 'preserve-3d' | Value;
type Transition = 'all' | 'allow-discrete' | 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'linear' | 'none' | 'normal' | 'step-end' | 'step-start' | Value;
type UserSelect = 'all' | 'auto' | 'contain' | 'none' | 'text' | Value;
type ViewTimelineAxis = 'block' | 'inline' | 'x' | 'y' | Value;
type VoicePitch = 'absolute' | 'high' | 'low' | 'medium' | 'x-high' | 'x-low' | Value;
type Width = 'contain' | 'fit-content' | 'max-content' | 'min-content' | 'stretch' | Value;
type Width2 = 'auto' | Value;
type WordWrap = 'anywhere' | 'break-word' | 'normal' | Value;
type WrapAfter = 'auto' | 'avoid' | 'avoid-flex' | 'avoid-line' | 'flex' | 'line' | Value;
type WrapInside = 'auto' | 'avoid' | Value;

export type KnownProperties = {
  WebkitAlignContent?: AlignContent | AlignContent2;
  WebkitAlignItems?: AlignSelf;
  WebkitAlignSelf?: AlignSelf | Width2;
  WebkitAnimation?: Animation;
  WebkitAnimationDelay?: Value;
  WebkitAnimationDirection?: AnimationDirection;
  WebkitAnimationDuration?: Value;
  WebkitAnimationFillMode?: AnimationFillMode;
  WebkitAnimationIterationCount?: AnimationIterationCount;
  WebkitAnimationName?: D;
  WebkitAnimationPlayState?: AnimationPlayState;
  WebkitAnimationTimingFunction?: AnimationTimingFunction;
  WebkitAppearance?: Appearance;
  WebkitBackfaceVisibility?: BackfaceVisibility;
  WebkitBackgroundClip?: BackgroundOrigin;
  WebkitBackgroundOrigin?: BackgroundOrigin;
  WebkitBackgroundSize?: FillSize;
  WebkitBorderBottomLeftRadius?: Value;
  WebkitBorderBottomRightRadius?: Value;
  WebkitBorderRadius?: Value;
  WebkitBorderTopLeftRadius?: Value;
  WebkitBorderTopRightRadius?: Value;
  WebkitBoxAlign?: Value;
  WebkitBoxFlex?: Value;
  WebkitBoxOrdinalGroup?: Value;
  WebkitBoxOrient?: Value;
  WebkitBoxPack?: Value;
  WebkitBoxShadow?: D;
  WebkitBoxSizing?: BoxSizing;
  WebkitFilter?: D;
  WebkitFlex?: D;
  WebkitFlexBasis?: FlexBasis;
  WebkitFlexDirection?: FlexDirection;
  WebkitFlexFlow?: Value;
  WebkitFlexGrow?: Value;
  WebkitFlexShrink?: Value;
  WebkitFlexWrap?: FlexWrap;
  WebkitJustifyContent?: JustifyContent | JustifyContent2;
  WebkitLineClamp?: D;
  WebkitMask?: Mask;
  WebkitMaskBoxImage?: Value;
  WebkitMaskBoxImageOutset?: Value;
  WebkitMaskBoxImageRepeat?: Value;
  WebkitMaskBoxImageSlice?: Value;
  WebkitMaskBoxImageSource?: Value;
  WebkitMaskBoxImageWidth?: Value;
  WebkitMaskClip?: MaskClip | MaskClip2;
  WebkitMaskComposite?: MaskComposite;
  WebkitMaskImage?: D;
  WebkitMaskOrigin?: MaskClip;
  WebkitMaskPosition?: FillPosition;
  WebkitMaskRepeat?: FillRepeat;
  WebkitMaskSize?: FillSize;
  WebkitOrder?: Value;
  WebkitPerspective?: D;
  WebkitPerspectiveOrigin?: FillPosition;
  WebkitTextFillColor?: Color;
  WebkitTextSizeAdjust?: Overlay;
  WebkitTextStroke?: Color | 'hairline' | 'medium' | 'thick' | 'thin';
  WebkitTextStrokeColor?: Color;
  WebkitTextStrokeWidth?: RowGap;
  WebkitTransform?: D;
  WebkitTransformOrigin?: TransformOrigin;
  WebkitTransformStyle?: TransformStyle;
  WebkitTransition?: Transition;
  WebkitTransitionDelay?: Value;
  WebkitTransitionDuration?: Value;
  WebkitTransitionProperty?: AnchorScope;
  WebkitTransitionTimingFunction?: AnimationTimingFunction;
  WebkitUserSelect?: UserSelect;
  accentColor?: Color | Width2;
  alignContent?: AlignContent | AlignContent2;
  alignItems?: AlignSelf;
  alignSelf?: AlignSelf | 'anchor-center' | 'auto';
  alignmentBaseline?: DominantBaseline | 'baseline';
  all?: 'revert-rule' | Value;
  anchorName?: D;
  anchorScope?: AnchorScope;
  animation?: Animation;
  animationComposition?: 'accumulate' | 'add' | 'replace' | Value;
  animationDelay?: Value;
  animationDelayEnd?: Value;
  animationDelayStart?: Value;
  animationDirection?: AnimationDirection;
  animationDuration?: Rx;
  animationFillMode?: AnimationFillMode;
  animationIterationCount?: AnimationIterationCount;
  animationName?: D;
  animationPlayState?: AnimationPlayState;
  animationRange?: Value;
  animationRangeCenter?: TextBox;
  animationRangeEnd?: TextBox;
  animationRangeStart?: TextBox;
  animationTimeline?: Overlay;
  animationTimingFunction?: AnimationTimingFunction;
  animationTrigger?: D;
  appearance?: Appearance;
  aspectRatio?: Rx;
  backdropFilter?: D;
  backfaceVisibility?: BackfaceVisibility;
  background?: Background;
  backgroundAttachment?: 'fixed' | 'local' | 'scroll' | Value;
  backgroundBlendMode?: Value;
  backgroundClip?: 'border-area' | 'border-box' | 'content-box' | 'padding-box' | 'text' | Value;
  backgroundColor?: Color;
  backgroundImage?: D;
  backgroundOrigin?: BackgroundOrigin;
  backgroundPosition?: FillPosition;
  backgroundPositionBlock?: BlockStepAlign;
  backgroundPositionInline?: BlockStepAlign;
  backgroundPositionX?: 'center' | 'left' | 'right' | 'x-end' | 'x-start' | Value;
  backgroundPositionY?: 'bottom' | 'center' | 'top' | 'y-end' | 'y-start' | Value;
  backgroundRepeat?: FillRepeat;
  backgroundRepeatBlock?: BackgroundRepeatX | BackgroundRepeatX2;
  backgroundRepeatInline?: BackgroundRepeatX | BackgroundRepeatX2;
  backgroundRepeatX?: BackgroundRepeatX | BackgroundRepeatX2;
  backgroundRepeatY?: BackgroundRepeatX | BackgroundRepeatX2;
  backgroundSize?: FillSize;
  backgroundTbd?: Background;
  baselineShift?: 'bottom' | 'center' | 'sub' | 'super' | 'top' | Value;
  baselineSource?: 'auto' | 'first' | 'last' | Value;
  blockEllipsis?: 'ellipsis' | 'no-ellipsis' | Value;
  blockSize?: Width | Width2;
  blockStep?: Value;
  blockStepAlign?: BlockStepAlign | Width2;
  blockStepInsert?: 'content-box' | 'margin-box' | 'padding-box' | Value;
  blockStepRound?: 'down' | 'nearest' | 'up' | Value;
  blockStepSize?: D;
  bookmarkLabel?: Content;
  bookmarkLevel?: D;
  bookmarkState?: 'closed' | 'open' | Value;
  border?: Color | Border;
  borderBlock?: Value;
  borderBlockClip?: Value;
  borderBlockColor?: Value;
  borderBlockEnd?: Color | Border;
  borderBlockEndClip?: D;
  borderBlockEndColor?: Color;
  borderBlockEndRadius?: Value;
  borderBlockEndStyle?: OutlineStyle | BorderTopStyle;
  borderBlockEndWidth?: RowGap;
  borderBlockStart?: Color | Border;
  borderBlockStartClip?: D;
  borderBlockStartColor?: Color;
  borderBlockStartRadius?: Value;
  borderBlockStartStyle?: OutlineStyle | BorderTopStyle;
  borderBlockStartWidth?: RowGap;
  borderBlockStyle?: Value;
  borderBlockWidth?: Value;
  borderBottom?: Color | Border;
  borderBottomClip?: D;
  borderBottomColor?: Color;
  borderBottomLeftRadius?: Value;
  borderBottomRadius?: Value;
  borderBottomRightRadius?: Value;
  borderBottomStyle?: OutlineStyle | BorderTopStyle;
  borderBottomWidth?: RowGap;
  borderBoundary?: 'display' | 'none' | 'parent' | Value;
  borderClip?: Value;
  borderCollapse?: 'collapse' | 'separate' | Value;
  borderColor?: Color;
  borderEndEndRadius?: Value;
  borderEndStartRadius?: Value;
  borderImage?: Value;
  borderImageOutset?: Value;
  borderImageRepeat?: BackgroundRepeatX | 'stretch';
  borderImageSlice?: 'fill' | Value;
  borderImageSource?: D;
  borderImageWidth?: Rx;
  borderInline?: Value;
  borderInlineClip?: Value;
  borderInlineColor?: Value;
  borderInlineEnd?: Color | Border;
  borderInlineEndClip?: D;
  borderInlineEndColor?: Color;
  borderInlineEndRadius?: Value;
  borderInlineEndStyle?: OutlineStyle | BorderTopStyle;
  borderInlineEndWidth?: RowGap;
  borderInlineStart?: Color | Border;
  borderInlineStartClip?: D;
  borderInlineStartColor?: Color;
  borderInlineStartRadius?: Value;
  borderInlineStartStyle?: OutlineStyle | BorderTopStyle;
  borderInlineStartWidth?: RowGap;
  borderInlineStyle?: Value;
  borderInlineWidth?: Value;
  borderLeft?: Color | Border;
  borderLeftClip?: D;
  borderLeftColor?: Color;
  borderLeftRadius?: Value;
  borderLeftStyle?: OutlineStyle | BorderTopStyle;
  borderLeftWidth?: RowGap;
  borderLimit?: 'all' | 'bottom' | 'corners' | 'left' | 'right' | 'sides' | 'top' | Value;
  borderRadius?: Value;
  borderRight?: Color | Border;
  borderRightClip?: D;
  borderRightColor?: Color;
  borderRightRadius?: Value;
  borderRightStyle?: OutlineStyle | BorderTopStyle;
  borderRightWidth?: RowGap;
  borderShape?: ClipPath | ClipPath2;
  borderSpacing?: Value;
  borderStartEndRadius?: Value;
  borderStartStartRadius?: Value;
  borderStyle?: Value;
  borderTop?: Color | Border;
  borderTopClip?: D;
  borderTopColor?: Color;
  borderTopLeftRadius?: Value;
  borderTopRadius?: Value;
  borderTopRightRadius?: Value;
  borderTopStyle?: OutlineStyle | BorderTopStyle;
  borderTopWidth?: RowGap;
  borderWidth?: Value;
  bottom?: Rx;
  boxDecorationBreak?: 'clone' | 'slice' | Value;
  boxShadow?: D;
  boxShadowBlur?: Value;
  boxShadowColor?: Color;
  boxShadowOffset?: D;
  boxShadowPosition?: 'inset' | 'outset' | Value;
  boxShadowSpread?: Value;
  boxSizing?: BoxSizing;
  boxSnap?: 'baseline' | 'block-end' | 'block-start' | 'center' | 'last-baseline' | 'none' | Value;
  breakAfter?: BreakAfter;
  breakBefore?: BreakAfter;
  breakInside?: 'auto' | 'avoid' | 'avoid-column' | 'avoid-page' | 'avoid-region' | Value;
  captionSide?: 'bottom' | 'top' | Value;
  caret?: Value;
  caretAnimation?: 'auto' | 'manual' | Value;
  caretColor?: Color | Width2;
  caretShape?: 'auto' | 'bar' | 'block' | 'underscore' | Value;
  clear?: Clear | 'both' | 'both-block' | 'both-inline';
  clip?: Rx;
  clipPath?: ClipPath | ClipPath2;
  clipRule?: ClipRule;
  color?: Color;
  colorAdjust?: Value;
  colorInterpolation?: ColorInterpolation;
  colorInterpolationFilters?: ColorInterpolation;
  colorScheme?: ColorScheme | 'only';
  columnCount?: Rx;
  columnFill?: 'auto' | 'balance' | 'balance-all' | Value;
  columnGap?: RowGap | RowGap2;
  columnHeight?: Rx;
  columnRule?: Color | Border | RowRule;
  columnRuleBreak?: RowRuleBreak;
  columnRuleColor?: Color | Width2;
  columnRuleInset?: Value;
  columnRuleInsetCap?: RowRuleInsetCap;
  columnRuleInsetCapEnd?: RowRuleInsetCap;
  columnRuleInsetCapStart?: RowRuleInsetCap;
  columnRuleInsetEnd?: RowRuleInsetCap;
  columnRuleInsetJunction?: RowRuleInsetCap;
  columnRuleInsetJunctionEnd?: RowRuleInsetCap;
  columnRuleInsetJunctionStart?: RowRuleInsetCap;
  columnRuleInsetStart?: RowRuleInsetCap;
  columnRuleStyle?: OutlineStyle | RowRuleStyle;
  columnRuleVisibilityItems?: RowRuleVisibilityItems;
  columnRuleWidth?: RowRuleWidth;
  columnSpan?: ColumnSpan;
  columnWidth?: Width | Width2;
  columnWrap?: 'auto' | 'nowrap' | 'wrap' | Value;
  columns?: Value;
  contain?: 'content' | 'inline-size' | 'layout' | 'none' | 'paint' | 'size' | 'strict' | 'style' | Value;
  containIntrinsicBlockSize?: Overlay;
  containIntrinsicHeight?: Overlay;
  containIntrinsicInlineSize?: Overlay;
  containIntrinsicSize?: Overlay;
  containIntrinsicWidth?: Overlay;
  container?: Value;
  containerName?: D;
  containerType?: 'inline-size' | 'normal' | 'scroll-state' | 'size' | Value;
  content?: Content | 'none' | 'normal';
  contentVisibility?: 'auto' | 'hidden' | 'visible' | Value;
  continue?: '-webkit-legacy' | 'collapse' | 'discard' | 'fragments' | 'normal' | 'overflow' | 'paginate' | Value;
  copyInto?: CopyInto | 'text';
  corner?: Value;
  cornerBlockEnd?: Value;
  cornerBlockEndShape?: Value;
  cornerBlockStart?: Value;
  cornerBlockStartShape?: Value;
  cornerBottom?: Value;
  cornerBottomLeft?: Value;
  cornerBottomLeftShape?: CornerEndEndShape;
  cornerBottomRight?: Value;
  cornerBottomRightShape?: CornerEndEndShape;
  cornerBottomShape?: Value;
  cornerEndEnd?: Value;
  cornerEndEndShape?: CornerEndEndShape;
  cornerEndStart?: Value;
  cornerEndStartShape?: CornerEndEndShape;
  cornerInlineEnd?: Value;
  cornerInlineEndShape?: Value;
  cornerInlineStart?: Value;
  cornerInlineStartShape?: Value;
  cornerLeft?: Value;
  cornerLeftShape?: Value;
  cornerRight?: Value;
  cornerRightShape?: Value;
  cornerShape?: Value;
  cornerStartEnd?: Value;
  cornerStartEndShape?: CornerEndEndShape;
  cornerStartStart?: Value;
  cornerStartStartShape?: CornerEndEndShape;
  cornerTop?: Value;
  cornerTopLeft?: Value;
  cornerTopLeftShape?: CornerEndEndShape;
  cornerTopRight?: Value;
  cornerTopRightShape?: CornerEndEndShape;
  cornerTopShape?: Value;
  counterIncrement?: D;
  counterReset?: D;
  counterSet?: D;
  cue?: Value;
  cueAfter?: D;
  cueBefore?: D;
  cursor?: 'alias' | 'all-scroll' | 'auto' | 'cell' | 'col-resize' | 'context-menu' | 'copy' | 'crosshair' | 'default' | 'e-resize' | 'ew-resize' | 'grab' | 'grabbing' | 'help' | 'move' | 'n-resize' | 'ne-resize' | 'nesw-resize' | 'no-drop' | 'none' | 'not-allowed' | 'ns-resize' | 'nw-resize' | 'nwse-resize' | 'pointer' | 'progress' | 'row-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'text' | 'vertical-text' | 'w-resize' | 'wait' | 'zoom-in' | 'zoom-out' | Value;
  cx?: Value;
  cy?: Value;
  d?: D;
  direction?: 'ltr' | 'rtl' | Value;
  display?: 'block' | 'contents' | 'flex' | 'flow' | 'flow-root' | 'grid' | 'grid-lanes' | 'inline' | 'inline-block' | 'inline-flex' | 'inline-grid' | 'inline-grid-lanes' | 'inline-table' | 'list-item' | 'math' | 'none' | 'ruby' | 'ruby-base' | 'ruby-base-container' | 'ruby-text' | 'ruby-text-container' | 'run-in' | 'table' | 'table-caption' | 'table-cell' | 'table-column' | 'table-column-group' | 'table-footer-group' | 'table-header-group' | 'table-row' | 'table-row-group' | Value;
  dominantBaseline?: DominantBaseline | Width2;
  dynamicRangeLimit?: 'constrained' | 'no-limit' | 'standard' | Value;
  emptyCells?: 'hide' | 'show' | Value;
  eventTrigger?: D;
  eventTriggerName?: D;
  eventTriggerSource?: D;
  fieldSizing?: 'content' | 'fixed' | Value;
  fill?: Fill;
  fillBreak?: FillBreak;
  fillColor?: Color;
  fillImage?: Fill;
  fillOpacity?: Value;
  fillOrigin?: FillOrigin | FillOrigin2;
  fillPosition?: FillPosition;
  fillRepeat?: FillRepeat;
  fillRule?: ClipRule;
  fillSize?: FillSize;
  filter?: D;
  fitTolerance?: 'infinite' | 'normal' | Value;
  flex?: D;
  flexBasis?: FlexBasis;
  flexDirection?: FlexDirection;
  flexFlow?: Value;
  flexGrow?: Value;
  flexLineCount?: Value;
  flexShrink?: Value;
  flexWrap?: FlexWrap;
  float?: Clear | 'footnote' | 'snap-block' | 'snap-inline';
  floatDefer?: 'last' | 'none' | Value;
  floatOffset?: Value;
  floatReference?: 'column' | 'inline' | 'page' | 'region' | Value;
  floodColor?: Color;
  floodOpacity?: Value;
  flowFrom?: D;
  flowInto?: CopyInto;
  font?: 'caption' | 'condensed' | 'expanded' | 'extra-condensed' | 'extra-expanded' | 'icon' | 'menu' | 'message-box' | 'normal' | 'semi-condensed' | 'semi-expanded' | 'small-caps' | 'small-caption' | 'status-bar' | 'ultra-condensed' | 'ultra-expanded' | Value;
  fontFamily?: 'cursive' | 'fangsong' | 'fantasy' | 'kai' | 'khmer-mul' | 'math' | 'monospace' | 'nastaliq' | 'sans-serif' | 'serif' | 'system-ui' | 'ui-monospace' | 'ui-rounded' | 'ui-sans-serif' | 'ui-serif' | Value;
  fontFeatureSettings?: 'normal' | 'off' | 'on' | Value;
  fontKerning?: FontKerning;
  fontLanguageOverride?: TextBox;
  fontOpticalSizing?: Overlay;
  fontPalette?: ColorScheme;
  fontSize?: 'large' | 'larger' | 'math' | 'medium' | 'small' | 'smaller' | 'x-large' | 'x-small' | 'xx-large' | 'xx-small' | 'xxx-large' | Value;
  fontSizeAdjust?: 'cap-height' | 'ch-width' | 'ex-height' | 'from-font' | 'ic-height' | 'ic-width' | 'none' | Value;
  fontStretch?: FontWidth;
  fontStyle?: 'italic' | 'left' | 'normal' | 'oblique' | 'right' | Value;
  fontSynthesis?: 'none' | 'position' | 'small-caps' | 'style' | 'weight' | Value;
  fontSynthesisPosition?: Overlay;
  fontSynthesisSmallCaps?: Overlay;
  fontSynthesisStyle?: 'auto' | 'none' | 'oblique-only' | Value;
  fontSynthesisWeight?: Overlay;
  fontVariant?: 'all-petite-caps' | 'all-small-caps' | 'common-ligatures' | 'contextual' | 'diagonal-fractions' | 'discretionary-ligatures' | 'emoji' | 'full-width' | 'historical-forms' | 'historical-ligatures' | 'jis04' | 'jis78' | 'jis83' | 'jis90' | 'lining-nums' | 'no-common-ligatures' | 'no-contextual' | 'no-discretionary-ligatures' | 'no-historical-ligatures' | 'none' | 'normal' | 'oldstyle-nums' | 'ordinal' | 'petite-caps' | 'proportional-nums' | 'proportional-width' | 'ruby' | 'simplified' | 'slashed-zero' | 'small-caps' | 'stacked-fractions' | 'sub' | 'super' | 'tabular-nums' | 'text' | 'titling-caps' | 'traditional' | 'unicase' | 'unicode' | Value;
  fontVariantAlternates?: 'historical-forms' | 'normal' | Value;
  fontVariantCaps?: 'all-petite-caps' | 'all-small-caps' | 'normal' | 'petite-caps' | 'small-caps' | 'titling-caps' | 'unicase' | Value;
  fontVariantEastAsian?: 'full-width' | 'jis04' | 'jis78' | 'jis83' | 'jis90' | 'normal' | 'proportional-width' | 'ruby' | 'simplified' | 'traditional' | Value;
  fontVariantEmoji?: 'emoji' | 'normal' | 'text' | 'unicode' | Value;
  fontVariantLigatures?: 'common-ligatures' | 'contextual' | 'discretionary-ligatures' | 'historical-ligatures' | 'no-common-ligatures' | 'no-contextual' | 'no-discretionary-ligatures' | 'no-historical-ligatures' | 'none' | 'normal' | Value;
  fontVariantNumeric?: 'diagonal-fractions' | 'lining-nums' | 'normal' | 'oldstyle-nums' | 'ordinal' | 'proportional-nums' | 'slashed-zero' | 'stacked-fractions' | 'tabular-nums' | Value;
  fontVariantPosition?: 'normal' | 'sub' | 'super' | Value;
  fontVariationSettings?: TextBox;
  fontWeight?: 'bold' | 'bolder' | 'lighter' | 'normal' | Value;
  fontWidth?: FontWidth;
  footnoteDisplay?: 'block' | 'compact' | 'inline' | Value;
  footnotePolicy?: 'auto' | 'block' | 'line' | Value;
  forcedColorAdjust?: 'auto' | 'none' | 'preserve-parent-color' | Value;
  frameSizing?: 'auto' | 'content-block-size' | 'content-height' | 'content-inline-size' | 'content-width' | Value;
  gap?: Value;
  glyphOrientationVertical?: '0' | '0deg' | '90' | '90deg' | 'auto' | Value;
  grid?: 'auto-flow' | 'dense' | Value;
  gridArea?: GridRow;
  gridAutoColumns?: GridAutoRows;
  gridAutoFlow?: 'column' | 'dense' | 'row' | Value;
  gridAutoRows?: GridAutoRows;
  gridColumn?: GridRow;
  gridColumnEnd?: GridRow;
  gridColumnGap?: RowGap | RowGap2;
  gridColumnStart?: GridRow;
  gridGap?: Value;
  gridRow?: GridRow;
  gridRowEnd?: GridRow;
  gridRowGap?: RowGap | RowGap2;
  gridRowStart?: GridRow;
  gridTemplate?: GridAutoRows | MaxWidth;
  gridTemplateAreas?: D;
  gridTemplateColumns?: GridTemplateRows;
  gridTemplateRows?: GridTemplateRows;
  hangingPunctuation?: 'allow-end' | 'first' | 'force-end' | 'last' | 'none' | Value;
  height?: Width | Width2;
  hyphenateCharacter?: Rx;
  hyphenateLimitChars?: Rx;
  hyphenateLimitLast?: 'always' | 'column' | 'none' | 'page' | 'spread' | Value;
  hyphenateLimitLines?: 'no-limit' | Value;
  hyphenateLimitZone?: Value;
  hyphens?: 'auto' | 'manual' | 'none' | Value;
  imageAnimation?: 'normal' | 'paused' | 'running' | 'stopped' | Value;
  imageOrientation?: 'flip' | 'from-image' | 'none' | Value;
  imageRendering?: 'auto' | 'crisp-edges' | 'high-quality' | 'pixelated' | 'smooth' | Value;
  imageResolution?: 'from-image' | 'snap' | Value;
  initialLetter?: 'drop' | 'normal' | 'raise' | Value;
  initialLetterAlign?: 'alphabetic' | 'border-box' | 'hanging' | 'ideographic' | 'leading' | Value;
  initialLetterWrap?: 'all' | 'first' | 'grid' | 'none' | Value;
  inlineSize?: Width | Width2;
  inlineSizing?: 'normal' | 'stretch' | Value;
  inputSecurity?: Overlay;
  inset?: Value;
  insetBlock?: Value;
  insetBlockEnd?: Rx;
  insetBlockStart?: Rx;
  insetInline?: Value;
  insetInlineEnd?: Rx;
  insetInlineStart?: Rx;
  interactivity?: 'auto' | 'inert' | Value;
  interestDelay?: Value;
  interestDelayEnd?: TextBox;
  interestDelayStart?: TextBox;
  interpolateSize?: 'allow-keywords' | 'numeric-only' | Value;
  isolation?: 'auto' | 'isolate' | Value;
  justifyContent?: JustifyContent | JustifyContent2;
  justifyItems?: AlignSelf | 'left' | 'legacy' | 'right';
  justifySelf?: AlignSelf | 'anchor-center' | 'auto' | 'left' | 'right';
  left?: Rx;
  letterSpacing?: TextBox;
  lightingColor?: Color;
  lineBreak?: 'anywhere' | 'auto' | 'loose' | 'normal' | 'strict' | Value;
  lineClamp?: '-webkit-legacy' | 'none' | Value;
  lineFitEdge?: LineFitEdge | 'leading';
  lineGrid?: 'create' | 'match-parent' | Value;
  lineHeight?: TextBox;
  lineHeightStep?: Value;
  linePadding?: Value;
  lineSnap?: 'baseline' | 'contain' | 'none' | Value;
  linkParameters?: D;
  listStyle?: Value;
  listStyleImage?: D;
  listStylePosition?: 'inside' | 'outside' | Value;
  listStyleType?: D;
  margin?: Value;
  marginBlock?: Value;
  marginBlockEnd?: Value;
  marginBlockStart?: Value;
  marginBottom?: Rx;
  marginBreak?: 'auto' | 'discard' | 'keep' | Value;
  marginInline?: Value;
  marginInlineEnd?: Value;
  marginInlineStart?: Value;
  marginLeft?: Rx;
  marginRight?: Rx;
  marginTop?: Rx;
  marginTrim?: 'block' | 'block-end' | 'block-start' | 'none' | Value;
  marker?: D;
  markerEnd?: D;
  markerMid?: D;
  markerSide?: 'match-parent' | 'match-self' | Value;
  markerStart?: D;
  mask?: Mask;
  maskBorder?: Value;
  maskBorderMode?: MaskType;
  maskBorderOutset?: Value;
  maskBorderRepeat?: Value;
  maskBorderSlice?: Value;
  maskBorderSource?: Value;
  maskBorderWidth?: Value;
  maskClip?: MaskClip | MaskClip2;
  maskComposite?: MaskComposite;
  maskImage?: D;
  maskMode?: 'alpha' | 'luminance' | 'match-source' | Value;
  maskOrigin?: MaskClip;
  maskPosition?: FillPosition;
  maskRepeat?: FillRepeat;
  maskSize?: FillSize;
  maskType?: MaskType;
  mathDepth?: 'auto-add' | Value;
  mathShift?: MathShift;
  mathStyle?: MathShift;
  maxBlockSize?: Width | MaxWidth;
  maxHeight?: Width | MaxWidth;
  maxInlineSize?: Width | MaxWidth;
  maxLines?: Rx;
  maxSize?: Value;
  maxWidth?: Width | MaxWidth;
  minBlockSize?: Width | Width2;
  minHeight?: Width | Width2;
  minInlineSize?: Width | Width2;
  minIntrinsicSizing?: 'legacy' | 'zero-if-extrinsic' | 'zero-if-scroll' | Value;
  minSize?: Value;
  minWidth?: Width | Width2;
  mixBlendMode?: 'color' | 'color-burn' | 'color-dodge' | 'darken' | 'difference' | 'exclusion' | 'hard-light' | 'hue' | 'lighten' | 'luminosity' | 'multiply' | 'normal' | 'overlay' | 'plus-lighter' | 'saturation' | 'screen' | 'soft-light' | Value;
  navDown?: NavUp;
  navLeft?: NavUp;
  navRight?: NavUp;
  navUp?: NavUp;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' | Value;
  objectPosition?: FillPosition;
  objectViewBox?: D;
  offset?: Value;
  offsetAnchor?: FillPosition | Width2;
  offsetDistance?: Value;
  offsetPath?: ClipPath;
  offsetPosition?: FillPosition | 'auto' | 'normal';
  offsetRotate?: 'auto' | 'reverse' | Value;
  opacity?: Value;
  order?: Value;
  orphans?: Value;
  outline?: Value;
  outlineColor?: Rx;
  outlineOffset?: Value;
  outlineStyle?: OutlineStyle | Width2;
  outlineWidth?: RowGap;
  overflow?: Value;
  overflowAnchor?: Overlay;
  overflowBlock?: OverflowX;
  overflowClipMargin?: BackgroundOrigin;
  overflowClipMarginBlock?: BackgroundOrigin;
  overflowClipMarginBlockEnd?: BackgroundOrigin;
  overflowClipMarginBlockStart?: BackgroundOrigin;
  overflowClipMarginBottom?: BackgroundOrigin;
  overflowClipMarginInline?: BackgroundOrigin;
  overflowClipMarginInlineEnd?: BackgroundOrigin;
  overflowClipMarginInlineStart?: BackgroundOrigin;
  overflowClipMarginLeft?: BackgroundOrigin;
  overflowClipMarginRight?: BackgroundOrigin;
  overflowClipMarginTop?: BackgroundOrigin;
  overflowInline?: OverflowX;
  overflowWrap?: WordWrap;
  overflowX?: OverflowX;
  overflowY?: OverflowX;
  overlay?: Overlay;
  overscrollBehavior?: OverscrollBehavior;
  overscrollBehaviorBlock?: OverscrollBehavior;
  overscrollBehaviorInline?: OverscrollBehavior;
  overscrollBehaviorX?: OverscrollBehavior;
  overscrollBehaviorY?: OverscrollBehavior;
  padding?: Value;
  paddingBlock?: Value;
  paddingBlockEnd?: Value;
  paddingBlockStart?: Value;
  paddingBottom?: Value;
  paddingInline?: Value;
  paddingInlineEnd?: Value;
  paddingInlineStart?: Value;
  paddingLeft?: Value;
  paddingRight?: Value;
  paddingTop?: Value;
  page?: Rx;
  pageBreakAfter?: PageBreakAfter;
  pageBreakBefore?: PageBreakAfter;
  pageBreakInside?: WrapInside;
  paintOrder?: 'fill' | 'markers' | 'normal' | 'stroke' | Value;
  pathLength?: D;
  pause?: Value;
  pauseAfter?: RestAfter;
  pauseBefore?: RestAfter;
  perspective?: D;
  perspectiveOrigin?: FillPosition;
  placeContent?: Value;
  placeItems?: Value;
  placeSelf?: Value;
  pointerEvents?: 'all' | 'auto' | 'bounding-box' | 'fill' | 'none' | 'painted' | 'stroke' | 'visible' | 'visibleFill' | 'visiblePainted' | 'visibleStroke' | Value;
  pointerTimeline?: Value;
  pointerTimelineAxis?: ViewTimelineAxis;
  pointerTimelineName?: D;
  position?: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky' | Value;
  positionAnchor?: FontKerning | FillOrigin2;
  positionArea?: PositionArea;
  positionTry?: Value;
  positionTryFallbacks?: PositionArea | 'flip-block' | 'flip-inline' | 'flip-start' | 'flip-x' | 'flip-y';
  positionTryOrder?: 'most-block-size' | 'most-height' | 'most-inline-size' | 'most-width' | 'normal' | Value;
  positionVisibility?: 'always' | 'anchor-valid' | 'anchor-visible' | 'no-overflow' | Value;
  printColorAdjust?: 'economy' | 'exact' | Value;
  quotes?: 'auto' | 'bikeshed-this' | 'none' | Value;
  r?: Value;
  readingFlow?: 'flex-flow' | 'flex-visual' | 'grid-columns' | 'grid-order' | 'grid-rows' | 'normal' | 'source-order' | Value;
  readingOrder?: Value;
  regionFragment?: 'auto' | 'break' | Value;
  resize?: 'block' | 'both' | 'horizontal' | 'inline' | 'none' | 'vertical' | Value;
  rest?: Value;
  restAfter?: RestAfter;
  restBefore?: RestAfter;
  right?: Rx;
  rotate?: 'none' | 'x' | 'y' | 'z' | Value;
  rowGap?: RowGap | RowGap2;
  rowRule?: Color | Border | RowRule;
  rowRuleBreak?: RowRuleBreak;
  rowRuleColor?: Color | Width2;
  rowRuleInset?: Value;
  rowRuleInsetCap?: RowRuleInsetCap;
  rowRuleInsetCapEnd?: RowRuleInsetCap;
  rowRuleInsetCapStart?: RowRuleInsetCap;
  rowRuleInsetEnd?: RowRuleInsetCap;
  rowRuleInsetJunction?: RowRuleInsetCap;
  rowRuleInsetJunctionEnd?: RowRuleInsetCap;
  rowRuleInsetJunctionStart?: RowRuleInsetCap;
  rowRuleInsetStart?: RowRuleInsetCap;
  rowRuleStyle?: OutlineStyle | RowRuleStyle;
  rowRuleVisibilityItems?: RowRuleVisibilityItems;
  rowRuleWidth?: RowRuleWidth;
  rubyAlign?: 'center' | 'space-around' | 'space-between' | 'start' | Value;
  rubyMerge?: 'auto' | 'merge' | 'separate' | Value;
  rubyOverhang?: 'auto' | 'spaces' | Value;
  rubyPosition?: 'alternate' | 'inter-character' | 'over' | 'under' | Value;
  rule?: Value;
  ruleBreak?: Value;
  ruleColor?: Value;
  ruleInset?: Value;
  ruleInsetCap?: Value;
  ruleInsetEnd?: Value;
  ruleInsetJunction?: Value;
  ruleInsetStart?: Value;
  ruleOverlap?: 'column-over-row' | 'row-over-column' | Value;
  ruleStyle?: Value;
  ruleVisibilityItems?: Value;
  ruleWidth?: Value;
  rx?: Rx;
  ry?: Rx;
  scale?: D;
  scrollAxisLock?: Overlay;
  scrollBehavior?: 'auto' | 'smooth' | Value;
  scrollInitialTarget?: 'nearest' | 'none' | Value;
  scrollMargin?: Value;
  scrollMarginBlock?: Value;
  scrollMarginBlockEnd?: Value;
  scrollMarginBlockStart?: Value;
  scrollMarginBottom?: Value;
  scrollMarginInline?: Value;
  scrollMarginInlineEnd?: Value;
  scrollMarginInlineStart?: Value;
  scrollMarginLeft?: Value;
  scrollMarginRight?: Value;
  scrollMarginTop?: Value;
  scrollMarkerGroup?: 'after' | 'before' | 'links' | 'none' | 'tabs' | Value;
  scrollPadding?: Rx;
  scrollPaddingBlock?: Rx;
  scrollPaddingBlockEnd?: Rx;
  scrollPaddingBlockStart?: Rx;
  scrollPaddingBottom?: Rx;
  scrollPaddingInline?: Rx;
  scrollPaddingInlineEnd?: Rx;
  scrollPaddingInlineStart?: Rx;
  scrollPaddingLeft?: Rx;
  scrollPaddingRight?: Rx;
  scrollPaddingTop?: Rx;
  scrollSnapAlign?: BlockStepAlign | MaxWidth;
  scrollSnapStop?: 'always' | 'normal' | Value;
  scrollSnapType?: 'block' | 'both' | 'inline' | 'mandatory' | 'none' | 'pair' | 'proximity' | 'x' | 'y' | Value;
  scrollTargetGroup?: Overlay;
  scrollTimeline?: Value;
  scrollTimelineAxis?: ViewTimelineAxis;
  scrollTimelineName?: D;
  scrollbarColor?: Color | Width2;
  scrollbarGutter?: 'auto' | 'both-edges' | 'stable' | Value;
  scrollbarWidth?: 'auto' | 'none' | 'thin' | Value;
  shapeImageThreshold?: Value;
  shapeInside?: 'auto' | 'display' | 'outside-shape' | 'shape-box' | Value;
  shapeMargin?: Value;
  shapeOutside?: 'border-box' | 'content-box' | 'half-border-box' | 'margin-box' | 'none' | 'padding-box' | Value;
  shapePadding?: Value;
  shapeRendering?: TextRendering | 'crispEdges';
  size?: Value;
  sliderOrientation?: 'auto' | 'bottom-to-top' | 'left-to-right' | 'right-to-left' | 'top-to-bottom' | Value;
  spatialNavigationAction?: 'auto' | 'focus' | 'scroll' | Value;
  spatialNavigationContain?: 'auto' | 'contain' | Value;
  spatialNavigationFunction?: 'grid' | 'normal' | Value;
  speak?: 'always' | 'auto' | 'never' | Value;
  speakAs?: 'digits' | 'literal-punctuation' | 'no-punctuation' | 'normal' | 'spell-out' | Value;
  stopColor?: Value;
  stopOpacity?: Value;
  stringSet?: D;
  stroke?: Fill;
  strokeAlign?: 'center' | 'inset' | 'outset' | Value;
  strokeAlignment?: 'center' | 'inner' | 'outer' | Value;
  strokeBreak?: FillBreak;
  strokeColor?: Color;
  strokeDashCorner?: D;
  strokeDashJustify?: StrokeDashadjust;
  strokeDashadjust?: StrokeDashadjust;
  strokeDasharray?: D;
  strokeDashcorner?: D;
  strokeDashoffset?: Value;
  strokeImage?: Fill;
  strokeLinecap?: 'butt' | 'round' | 'square' | Value;
  strokeLinejoin?: 'arcs' | 'bevel' | 'crop' | 'fallback' | 'miter' | 'round' | Value;
  strokeMiterlimit?: Value;
  strokeOpacity?: Value;
  strokeOrigin?: FillOrigin | FillOrigin2;
  strokePosition?: FillPosition;
  strokeRepeat?: FillRepeat;
  strokeSize?: FillSize;
  strokeWidth?: RowGap;
  tabSize?: Value;
  tableLayout?: 'auto' | 'fixed' | Value;
  textAlign?: TextAlign | 'justify-all';
  textAlignAll?: TextAlign;
  textAlignLast?: TextAlign | Width2;
  textAnchor?: 'end' | 'middle' | 'start' | Value;
  textAutospace?: 'auto' | 'ideograph-alpha' | 'ideograph-numeric' | 'insert' | 'no-autospace' | 'normal' | 'punctuation' | 'replace' | Value;
  textBox?: TextBox;
  textBoxEdge?: LineFitEdge | Width2;
  textBoxTrim?: 'none' | 'trim-both' | 'trim-end' | 'trim-start' | Value;
  textCombineUpright?: 'all' | 'digits' | 'none' | Value;
  textDecoration?: Value;
  textDecorationColor?: Color;
  textDecorationInset?: Rx;
  textDecorationLine?: 'blink' | 'grammar-error' | 'line-through' | 'none' | 'overline' | 'spelling-error' | 'underline' | Value;
  textDecorationSkip?: Overlay;
  textDecorationSkipBox?: AnchorScope;
  textDecorationSkipInk?: ColumnSpan;
  textDecorationSkipSelf?: 'auto' | 'no-skip' | 'skip-all' | 'skip-line-through' | 'skip-overline' | 'skip-underline' | Value;
  textDecorationSkipSpaces?: 'all' | 'end' | 'none' | 'start' | Value;
  textDecorationStyle?: 'dashed' | 'dotted' | 'double' | 'solid' | 'wavy' | Value;
  textDecorationThickness?: RowRuleWidth | 'from-font';
  textEmphasis?: Value;
  textEmphasisColor?: Color;
  textEmphasisPosition?: 'left' | 'over' | 'right' | 'under' | Value;
  textEmphasisSkip?: 'narrow' | 'punctuation' | 'spaces' | 'symbols' | Value;
  textEmphasisStyle?: 'circle' | 'dot' | 'double-circle' | 'filled' | 'none' | 'open' | 'sesame' | 'triangle' | Value;
  textFit?: 'consistent' | 'grow' | 'none' | 'per-line' | 'per-line-all' | 'shrink' | Value;
  textGroupAlign?: 'center' | 'end' | 'left' | 'none' | 'right' | 'start' | Value;
  textIndent?: 'each-line' | 'hanging' | Value;
  textJustify?: 'auto' | 'inter-character' | 'inter-word' | 'no-compress' | 'none' | 'ruby' | Value;
  textOrientation?: 'mixed' | 'sideways' | 'upright' | Value;
  textOverflow?: 'clip' | 'ellipsis' | 'fade' | Value;
  textRendering?: TextRendering | 'optimizeLegibility';
  textShadow?: Color | 'inset' | 'none';
  textSizeAdjust?: Overlay;
  textSpacing?: 'auto' | 'ideograph-alpha' | 'ideograph-numeric' | 'insert' | 'no-autospace' | 'none' | 'normal' | 'punctuation' | 'replace' | 'space-all' | 'space-first' | 'trim-all' | 'trim-both' | 'trim-start' | Value;
  textSpacingTrim?: 'auto' | 'normal' | 'space-all' | 'space-first' | 'trim-all' | 'trim-both' | 'trim-start' | Value;
  textTransform?: 'capitalize' | 'full-size-kana' | 'full-width' | 'lowercase' | 'math-auto' | 'none' | 'uppercase' | Value;
  textUnderlineOffset?: Rx;
  textUnderlinePosition?: 'auto' | 'from-font' | 'left' | 'right' | 'under' | Value;
  textWrap?: Value;
  textWrapMode?: 'nowrap' | 'wrap' | Value;
  textWrapStyle?: 'auto' | 'avoid-short-last-line' | 'balance' | 'pretty' | 'stable' | Value;
  timelineScope?: AnchorScope;
  timelineTrigger?: D;
  timelineTriggerActivationRange?: Value;
  timelineTriggerActivationRangeEnd?: TextBox;
  timelineTriggerActivationRangeStart?: TextBox;
  timelineTriggerActiveRange?: Value;
  timelineTriggerActiveRangeEnd?: TimelineTriggerActiveRangeEnd;
  timelineTriggerActiveRangeStart?: TimelineTriggerActiveRangeEnd;
  timelineTriggerName?: D;
  timelineTriggerRange?: Value;
  timelineTriggerSource?: Overlay;
  top?: Rx;
  touchAction?: 'auto' | 'manipulation' | 'none' | 'pan-down' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-x' | 'pan-y' | 'pinch-zoom' | Value;
  transform?: D;
  transformBox?: 'border-box' | 'content-box' | 'fill-box' | 'stroke-box' | 'view-box' | Value;
  transformOrigin?: TransformOrigin;
  transformStyle?: TransformStyle;
  transition?: Transition;
  transitionBehavior?: 'allow-discrete' | 'normal' | Value;
  transitionDelay?: Value;
  transitionDuration?: Value;
  transitionProperty?: AnchorScope;
  transitionTimingFunction?: AnimationTimingFunction;
  translate?: D;
  triggerScope?: AnchorScope;
  unicodeBidi?: 'bidi-override' | 'embed' | 'isolate' | 'isolate-override' | 'normal' | 'plaintext' | Value;
  userSelect?: UserSelect;
  vectorEffect?: 'fixed-position' | 'non-rotation' | 'non-scaling-size' | 'non-scaling-stroke' | 'none' | Value;
  verticalAlign?: 'first' | 'last' | Value;
  viewTimeline?: Value;
  viewTimelineAxis?: ViewTimelineAxis;
  viewTimelineInset?: Rx;
  viewTimelineName?: D;
  viewTransitionClass?: D;
  viewTransitionGroup?: 'contain' | 'nearest' | 'normal' | Value;
  viewTransitionName?: D;
  viewTransitionScope?: AnchorScope;
  visibility?: 'collapse' | 'force-hidden' | 'hidden' | 'visible' | Value;
  voiceBalance?: 'center' | 'left' | 'leftwards' | 'right' | 'rightwards' | Value;
  voiceDuration?: Rx;
  voiceFamily?: 'preserve' | Value;
  voicePitch?: VoicePitch;
  voiceRange?: VoicePitch;
  voiceRate?: 'fast' | 'medium' | 'normal' | 'slow' | 'x-fast' | 'x-slow' | Value;
  voiceStress?: 'moderate' | 'none' | 'normal' | 'reduced' | 'strong' | Value;
  voiceVolume?: 'loud' | 'medium' | 'silent' | 'soft' | 'x-loud' | 'x-soft' | Value;
  whiteSpace?: 'normal' | 'pre' | 'pre-line' | 'pre-wrap' | Value;
  whiteSpaceCollapse?: 'break-spaces' | 'collapse' | 'discard' | 'preserve' | 'preserve-breaks' | 'preserve-spaces' | Value;
  whiteSpaceTrim?: 'discard-after' | 'discard-before' | 'discard-inner' | 'none' | Value;
  widows?: Value;
  width?: Width | Width2;
  willChange?: 'auto' | 'contents' | 'scroll-position' | Value;
  windowDrag?: 'move' | 'none' | Value;
  wordBreak?: 'auto-phrase' | 'break-all' | 'break-word' | 'keep-all' | 'manual' | 'normal' | Value;
  wordSpaceTransform?: 'auto-phrase' | 'ideographic-space' | 'none' | 'space' | Value;
  wordSpacing?: TextBox;
  wordWrap?: WordWrap;
  wrapAfter?: WrapAfter;
  wrapBefore?: WrapAfter;
  wrapFlow?: 'auto' | 'both' | 'clear' | 'end' | 'maximum' | 'minimum' | 'start' | Value;
  wrapInside?: WrapInside;
  wrapThrough?: 'none' | 'wrap' | Value;
  writingMode?: 'horizontal-tb' | 'sideways-lr' | 'sideways-rl' | 'vertical-lr' | 'vertical-rl' | Value;
  x?: Value;
  y?: Value;
  zIndex?: Rx;
  zoom?: Value;
};

export type PropertyName =
  | '-webkit-align-content'
  | '-webkit-align-items'
  | '-webkit-align-self'
  | '-webkit-animation'
  | '-webkit-animation-delay'
  | '-webkit-animation-direction'
  | '-webkit-animation-duration'
  | '-webkit-animation-fill-mode'
  | '-webkit-animation-iteration-count'
  | '-webkit-animation-name'
  | '-webkit-animation-play-state'
  | '-webkit-animation-timing-function'
  | '-webkit-appearance'
  | '-webkit-backface-visibility'
  | '-webkit-background-clip'
  | '-webkit-background-origin'
  | '-webkit-background-size'
  | '-webkit-border-bottom-left-radius'
  | '-webkit-border-bottom-right-radius'
  | '-webkit-border-radius'
  | '-webkit-border-top-left-radius'
  | '-webkit-border-top-right-radius'
  | '-webkit-box-align'
  | '-webkit-box-flex'
  | '-webkit-box-ordinal-group'
  | '-webkit-box-orient'
  | '-webkit-box-pack'
  | '-webkit-box-shadow'
  | '-webkit-box-sizing'
  | '-webkit-filter'
  | '-webkit-flex'
  | '-webkit-flex-basis'
  | '-webkit-flex-direction'
  | '-webkit-flex-flow'
  | '-webkit-flex-grow'
  | '-webkit-flex-shrink'
  | '-webkit-flex-wrap'
  | '-webkit-justify-content'
  | '-webkit-line-clamp'
  | '-webkit-mask'
  | '-webkit-mask-box-image'
  | '-webkit-mask-box-image-outset'
  | '-webkit-mask-box-image-repeat'
  | '-webkit-mask-box-image-slice'
  | '-webkit-mask-box-image-source'
  | '-webkit-mask-box-image-width'
  | '-webkit-mask-clip'
  | '-webkit-mask-composite'
  | '-webkit-mask-image'
  | '-webkit-mask-origin'
  | '-webkit-mask-position'
  | '-webkit-mask-repeat'
  | '-webkit-mask-size'
  | '-webkit-order'
  | '-webkit-perspective'
  | '-webkit-perspective-origin'
  | '-webkit-text-fill-color'
  | '-webkit-text-size-adjust'
  | '-webkit-text-stroke'
  | '-webkit-text-stroke-color'
  | '-webkit-text-stroke-width'
  | '-webkit-transform'
  | '-webkit-transform-origin'
  | '-webkit-transform-style'
  | '-webkit-transition'
  | '-webkit-transition-delay'
  | '-webkit-transition-duration'
  | '-webkit-transition-property'
  | '-webkit-transition-timing-function'
  | '-webkit-user-select'
  | 'accent-color'
  | 'align-content'
  | 'align-items'
  | 'align-self'
  | 'alignment-baseline'
  | 'all'
  | 'anchor-name'
  | 'anchor-scope'
  | 'animation'
  | 'animation-composition'
  | 'animation-delay'
  | 'animation-delay-end'
  | 'animation-delay-start'
  | 'animation-direction'
  | 'animation-duration'
  | 'animation-fill-mode'
  | 'animation-iteration-count'
  | 'animation-name'
  | 'animation-play-state'
  | 'animation-range'
  | 'animation-range-center'
  | 'animation-range-end'
  | 'animation-range-start'
  | 'animation-timeline'
  | 'animation-timing-function'
  | 'animation-trigger'
  | 'appearance'
  | 'aspect-ratio'
  | 'backdrop-filter'
  | 'backface-visibility'
  | 'background'
  | 'background-attachment'
  | 'background-blend-mode'
  | 'background-clip'
  | 'background-color'
  | 'background-image'
  | 'background-origin'
  | 'background-position'
  | 'background-position-block'
  | 'background-position-inline'
  | 'background-position-x'
  | 'background-position-y'
  | 'background-repeat'
  | 'background-repeat-block'
  | 'background-repeat-inline'
  | 'background-repeat-x'
  | 'background-repeat-y'
  | 'background-size'
  | 'background-tbd'
  | 'baseline-shift'
  | 'baseline-source'
  | 'block-ellipsis'
  | 'block-size'
  | 'block-step'
  | 'block-step-align'
  | 'block-step-insert'
  | 'block-step-round'
  | 'block-step-size'
  | 'bookmark-label'
  | 'bookmark-level'
  | 'bookmark-state'
  | 'border'
  | 'border-block'
  | 'border-block-clip'
  | 'border-block-color'
  | 'border-block-end'
  | 'border-block-end-clip'
  | 'border-block-end-color'
  | 'border-block-end-radius'
  | 'border-block-end-style'
  | 'border-block-end-width'
  | 'border-block-start'
  | 'border-block-start-clip'
  | 'border-block-start-color'
  | 'border-block-start-radius'
  | 'border-block-start-style'
  | 'border-block-start-width'
  | 'border-block-style'
  | 'border-block-width'
  | 'border-bottom'
  | 'border-bottom-clip'
  | 'border-bottom-color'
  | 'border-bottom-left-radius'
  | 'border-bottom-radius'
  | 'border-bottom-right-radius'
  | 'border-bottom-style'
  | 'border-bottom-width'
  | 'border-boundary'
  | 'border-clip'
  | 'border-collapse'
  | 'border-color'
  | 'border-end-end-radius'
  | 'border-end-start-radius'
  | 'border-image'
  | 'border-image-outset'
  | 'border-image-repeat'
  | 'border-image-slice'
  | 'border-image-source'
  | 'border-image-width'
  | 'border-inline'
  | 'border-inline-clip'
  | 'border-inline-color'
  | 'border-inline-end'
  | 'border-inline-end-clip'
  | 'border-inline-end-color'
  | 'border-inline-end-radius'
  | 'border-inline-end-style'
  | 'border-inline-end-width'
  | 'border-inline-start'
  | 'border-inline-start-clip'
  | 'border-inline-start-color'
  | 'border-inline-start-radius'
  | 'border-inline-start-style'
  | 'border-inline-start-width'
  | 'border-inline-style'
  | 'border-inline-width'
  | 'border-left'
  | 'border-left-clip'
  | 'border-left-color'
  | 'border-left-radius'
  | 'border-left-style'
  | 'border-left-width'
  | 'border-limit'
  | 'border-radius'
  | 'border-right'
  | 'border-right-clip'
  | 'border-right-color'
  | 'border-right-radius'
  | 'border-right-style'
  | 'border-right-width'
  | 'border-shape'
  | 'border-spacing'
  | 'border-start-end-radius'
  | 'border-start-start-radius'
  | 'border-style'
  | 'border-top'
  | 'border-top-clip'
  | 'border-top-color'
  | 'border-top-left-radius'
  | 'border-top-radius'
  | 'border-top-right-radius'
  | 'border-top-style'
  | 'border-top-width'
  | 'border-width'
  | 'bottom'
  | 'box-decoration-break'
  | 'box-shadow'
  | 'box-shadow-blur'
  | 'box-shadow-color'
  | 'box-shadow-offset'
  | 'box-shadow-position'
  | 'box-shadow-spread'
  | 'box-sizing'
  | 'box-snap'
  | 'break-after'
  | 'break-before'
  | 'break-inside'
  | 'caption-side'
  | 'caret'
  | 'caret-animation'
  | 'caret-color'
  | 'caret-shape'
  | 'clear'
  | 'clip'
  | 'clip-path'
  | 'clip-rule'
  | 'color'
  | 'color-adjust'
  | 'color-interpolation'
  | 'color-interpolation-filters'
  | 'color-scheme'
  | 'column-count'
  | 'column-fill'
  | 'column-gap'
  | 'column-height'
  | 'column-rule'
  | 'column-rule-break'
  | 'column-rule-color'
  | 'column-rule-inset'
  | 'column-rule-inset-cap'
  | 'column-rule-inset-cap-end'
  | 'column-rule-inset-cap-start'
  | 'column-rule-inset-end'
  | 'column-rule-inset-junction'
  | 'column-rule-inset-junction-end'
  | 'column-rule-inset-junction-start'
  | 'column-rule-inset-start'
  | 'column-rule-style'
  | 'column-rule-visibility-items'
  | 'column-rule-width'
  | 'column-span'
  | 'column-width'
  | 'column-wrap'
  | 'columns'
  | 'contain'
  | 'contain-intrinsic-block-size'
  | 'contain-intrinsic-height'
  | 'contain-intrinsic-inline-size'
  | 'contain-intrinsic-size'
  | 'contain-intrinsic-width'
  | 'container'
  | 'container-name'
  | 'container-type'
  | 'content'
  | 'content-visibility'
  | 'continue'
  | 'copy-into'
  | 'corner'
  | 'corner-block-end'
  | 'corner-block-end-shape'
  | 'corner-block-start'
  | 'corner-block-start-shape'
  | 'corner-bottom'
  | 'corner-bottom-left'
  | 'corner-bottom-left-shape'
  | 'corner-bottom-right'
  | 'corner-bottom-right-shape'
  | 'corner-bottom-shape'
  | 'corner-end-end'
  | 'corner-end-end-shape'
  | 'corner-end-start'
  | 'corner-end-start-shape'
  | 'corner-inline-end'
  | 'corner-inline-end-shape'
  | 'corner-inline-start'
  | 'corner-inline-start-shape'
  | 'corner-left'
  | 'corner-left-shape'
  | 'corner-right'
  | 'corner-right-shape'
  | 'corner-shape'
  | 'corner-start-end'
  | 'corner-start-end-shape'
  | 'corner-start-start'
  | 'corner-start-start-shape'
  | 'corner-top'
  | 'corner-top-left'
  | 'corner-top-left-shape'
  | 'corner-top-right'
  | 'corner-top-right-shape'
  | 'corner-top-shape'
  | 'counter-increment'
  | 'counter-reset'
  | 'counter-set'
  | 'cue'
  | 'cue-after'
  | 'cue-before'
  | 'cursor'
  | 'cx'
  | 'cy'
  | 'd'
  | 'direction'
  | 'display'
  | 'dominant-baseline'
  | 'dynamic-range-limit'
  | 'empty-cells'
  | 'event-trigger'
  | 'event-trigger-name'
  | 'event-trigger-source'
  | 'field-sizing'
  | 'fill'
  | 'fill-break'
  | 'fill-color'
  | 'fill-image'
  | 'fill-opacity'
  | 'fill-origin'
  | 'fill-position'
  | 'fill-repeat'
  | 'fill-rule'
  | 'fill-size'
  | 'filter'
  | 'fit-tolerance'
  | 'flex'
  | 'flex-basis'
  | 'flex-direction'
  | 'flex-flow'
  | 'flex-grow'
  | 'flex-line-count'
  | 'flex-shrink'
  | 'flex-wrap'
  | 'float'
  | 'float-defer'
  | 'float-offset'
  | 'float-reference'
  | 'flood-color'
  | 'flood-opacity'
  | 'flow-from'
  | 'flow-into'
  | 'font'
  | 'font-family'
  | 'font-feature-settings'
  | 'font-kerning'
  | 'font-language-override'
  | 'font-optical-sizing'
  | 'font-palette'
  | 'font-size'
  | 'font-size-adjust'
  | 'font-stretch'
  | 'font-style'
  | 'font-synthesis'
  | 'font-synthesis-position'
  | 'font-synthesis-small-caps'
  | 'font-synthesis-style'
  | 'font-synthesis-weight'
  | 'font-variant'
  | 'font-variant-alternates'
  | 'font-variant-caps'
  | 'font-variant-east-asian'
  | 'font-variant-emoji'
  | 'font-variant-ligatures'
  | 'font-variant-numeric'
  | 'font-variant-position'
  | 'font-variation-settings'
  | 'font-weight'
  | 'font-width'
  | 'footnote-display'
  | 'footnote-policy'
  | 'forced-color-adjust'
  | 'frame-sizing'
  | 'gap'
  | 'glyph-orientation-vertical'
  | 'grid'
  | 'grid-area'
  | 'grid-auto-columns'
  | 'grid-auto-flow'
  | 'grid-auto-rows'
  | 'grid-column'
  | 'grid-column-end'
  | 'grid-column-gap'
  | 'grid-column-start'
  | 'grid-gap'
  | 'grid-row'
  | 'grid-row-end'
  | 'grid-row-gap'
  | 'grid-row-start'
  | 'grid-template'
  | 'grid-template-areas'
  | 'grid-template-columns'
  | 'grid-template-rows'
  | 'hanging-punctuation'
  | 'height'
  | 'hyphenate-character'
  | 'hyphenate-limit-chars'
  | 'hyphenate-limit-last'
  | 'hyphenate-limit-lines'
  | 'hyphenate-limit-zone'
  | 'hyphens'
  | 'image-animation'
  | 'image-orientation'
  | 'image-rendering'
  | 'image-resolution'
  | 'initial-letter'
  | 'initial-letter-align'
  | 'initial-letter-wrap'
  | 'inline-size'
  | 'inline-sizing'
  | 'input-security'
  | 'inset'
  | 'inset-block'
  | 'inset-block-end'
  | 'inset-block-start'
  | 'inset-inline'
  | 'inset-inline-end'
  | 'inset-inline-start'
  | 'interactivity'
  | 'interest-delay'
  | 'interest-delay-end'
  | 'interest-delay-start'
  | 'interpolate-size'
  | 'isolation'
  | 'justify-content'
  | 'justify-items'
  | 'justify-self'
  | 'left'
  | 'letter-spacing'
  | 'lighting-color'
  | 'line-break'
  | 'line-clamp'
  | 'line-fit-edge'
  | 'line-grid'
  | 'line-height'
  | 'line-height-step'
  | 'line-padding'
  | 'line-snap'
  | 'link-parameters'
  | 'list-style'
  | 'list-style-image'
  | 'list-style-position'
  | 'list-style-type'
  | 'margin'
  | 'margin-block'
  | 'margin-block-end'
  | 'margin-block-start'
  | 'margin-bottom'
  | 'margin-break'
  | 'margin-inline'
  | 'margin-inline-end'
  | 'margin-inline-start'
  | 'margin-left'
  | 'margin-right'
  | 'margin-top'
  | 'margin-trim'
  | 'marker'
  | 'marker-end'
  | 'marker-mid'
  | 'marker-side'
  | 'marker-start'
  | 'mask'
  | 'mask-border'
  | 'mask-border-mode'
  | 'mask-border-outset'
  | 'mask-border-repeat'
  | 'mask-border-slice'
  | 'mask-border-source'
  | 'mask-border-width'
  | 'mask-clip'
  | 'mask-composite'
  | 'mask-image'
  | 'mask-mode'
  | 'mask-origin'
  | 'mask-position'
  | 'mask-repeat'
  | 'mask-size'
  | 'mask-type'
  | 'math-depth'
  | 'math-shift'
  | 'math-style'
  | 'max-block-size'
  | 'max-height'
  | 'max-inline-size'
  | 'max-lines'
  | 'max-size'
  | 'max-width'
  | 'min-block-size'
  | 'min-height'
  | 'min-inline-size'
  | 'min-intrinsic-sizing'
  | 'min-size'
  | 'min-width'
  | 'mix-blend-mode'
  | 'nav-down'
  | 'nav-left'
  | 'nav-right'
  | 'nav-up'
  | 'object-fit'
  | 'object-position'
  | 'object-view-box'
  | 'offset'
  | 'offset-anchor'
  | 'offset-distance'
  | 'offset-path'
  | 'offset-position'
  | 'offset-rotate'
  | 'opacity'
  | 'order'
  | 'orphans'
  | 'outline'
  | 'outline-color'
  | 'outline-offset'
  | 'outline-style'
  | 'outline-width'
  | 'overflow'
  | 'overflow-anchor'
  | 'overflow-block'
  | 'overflow-clip-margin'
  | 'overflow-clip-margin-block'
  | 'overflow-clip-margin-block-end'
  | 'overflow-clip-margin-block-start'
  | 'overflow-clip-margin-bottom'
  | 'overflow-clip-margin-inline'
  | 'overflow-clip-margin-inline-end'
  | 'overflow-clip-margin-inline-start'
  | 'overflow-clip-margin-left'
  | 'overflow-clip-margin-right'
  | 'overflow-clip-margin-top'
  | 'overflow-inline'
  | 'overflow-wrap'
  | 'overflow-x'
  | 'overflow-y'
  | 'overlay'
  | 'overscroll-behavior'
  | 'overscroll-behavior-block'
  | 'overscroll-behavior-inline'
  | 'overscroll-behavior-x'
  | 'overscroll-behavior-y'
  | 'padding'
  | 'padding-block'
  | 'padding-block-end'
  | 'padding-block-start'
  | 'padding-bottom'
  | 'padding-inline'
  | 'padding-inline-end'
  | 'padding-inline-start'
  | 'padding-left'
  | 'padding-right'
  | 'padding-top'
  | 'page'
  | 'page-break-after'
  | 'page-break-before'
  | 'page-break-inside'
  | 'paint-order'
  | 'path-length'
  | 'pause'
  | 'pause-after'
  | 'pause-before'
  | 'perspective'
  | 'perspective-origin'
  | 'place-content'
  | 'place-items'
  | 'place-self'
  | 'pointer-events'
  | 'pointer-timeline'
  | 'pointer-timeline-axis'
  | 'pointer-timeline-name'
  | 'position'
  | 'position-anchor'
  | 'position-area'
  | 'position-try'
  | 'position-try-fallbacks'
  | 'position-try-order'
  | 'position-visibility'
  | 'print-color-adjust'
  | 'quotes'
  | 'r'
  | 'reading-flow'
  | 'reading-order'
  | 'region-fragment'
  | 'resize'
  | 'rest'
  | 'rest-after'
  | 'rest-before'
  | 'right'
  | 'rotate'
  | 'row-gap'
  | 'row-rule'
  | 'row-rule-break'
  | 'row-rule-color'
  | 'row-rule-inset'
  | 'row-rule-inset-cap'
  | 'row-rule-inset-cap-end'
  | 'row-rule-inset-cap-start'
  | 'row-rule-inset-end'
  | 'row-rule-inset-junction'
  | 'row-rule-inset-junction-end'
  | 'row-rule-inset-junction-start'
  | 'row-rule-inset-start'
  | 'row-rule-style'
  | 'row-rule-visibility-items'
  | 'row-rule-width'
  | 'ruby-align'
  | 'ruby-merge'
  | 'ruby-overhang'
  | 'ruby-position'
  | 'rule'
  | 'rule-break'
  | 'rule-color'
  | 'rule-inset'
  | 'rule-inset-cap'
  | 'rule-inset-end'
  | 'rule-inset-junction'
  | 'rule-inset-start'
  | 'rule-overlap'
  | 'rule-style'
  | 'rule-visibility-items'
  | 'rule-width'
  | 'rx'
  | 'ry'
  | 'scale'
  | 'scroll-axis-lock'
  | 'scroll-behavior'
  | 'scroll-initial-target'
  | 'scroll-margin'
  | 'scroll-margin-block'
  | 'scroll-margin-block-end'
  | 'scroll-margin-block-start'
  | 'scroll-margin-bottom'
  | 'scroll-margin-inline'
  | 'scroll-margin-inline-end'
  | 'scroll-margin-inline-start'
  | 'scroll-margin-left'
  | 'scroll-margin-right'
  | 'scroll-margin-top'
  | 'scroll-marker-group'
  | 'scroll-padding'
  | 'scroll-padding-block'
  | 'scroll-padding-block-end'
  | 'scroll-padding-block-start'
  | 'scroll-padding-bottom'
  | 'scroll-padding-inline'
  | 'scroll-padding-inline-end'
  | 'scroll-padding-inline-start'
  | 'scroll-padding-left'
  | 'scroll-padding-right'
  | 'scroll-padding-top'
  | 'scroll-snap-align'
  | 'scroll-snap-stop'
  | 'scroll-snap-type'
  | 'scroll-target-group'
  | 'scroll-timeline'
  | 'scroll-timeline-axis'
  | 'scroll-timeline-name'
  | 'scrollbar-color'
  | 'scrollbar-gutter'
  | 'scrollbar-width'
  | 'shape-image-threshold'
  | 'shape-inside'
  | 'shape-margin'
  | 'shape-outside'
  | 'shape-padding'
  | 'shape-rendering'
  | 'size'
  | 'slider-orientation'
  | 'spatial-navigation-action'
  | 'spatial-navigation-contain'
  | 'spatial-navigation-function'
  | 'speak'
  | 'speak-as'
  | 'stop-color'
  | 'stop-opacity'
  | 'string-set'
  | 'stroke'
  | 'stroke-align'
  | 'stroke-alignment'
  | 'stroke-break'
  | 'stroke-color'
  | 'stroke-dash-corner'
  | 'stroke-dash-justify'
  | 'stroke-dashadjust'
  | 'stroke-dasharray'
  | 'stroke-dashcorner'
  | 'stroke-dashoffset'
  | 'stroke-image'
  | 'stroke-linecap'
  | 'stroke-linejoin'
  | 'stroke-miterlimit'
  | 'stroke-opacity'
  | 'stroke-origin'
  | 'stroke-position'
  | 'stroke-repeat'
  | 'stroke-size'
  | 'stroke-width'
  | 'tab-size'
  | 'table-layout'
  | 'text-align'
  | 'text-align-all'
  | 'text-align-last'
  | 'text-anchor'
  | 'text-autospace'
  | 'text-box'
  | 'text-box-edge'
  | 'text-box-trim'
  | 'text-combine-upright'
  | 'text-decoration'
  | 'text-decoration-color'
  | 'text-decoration-inset'
  | 'text-decoration-line'
  | 'text-decoration-skip'
  | 'text-decoration-skip-box'
  | 'text-decoration-skip-ink'
  | 'text-decoration-skip-self'
  | 'text-decoration-skip-spaces'
  | 'text-decoration-style'
  | 'text-decoration-thickness'
  | 'text-emphasis'
  | 'text-emphasis-color'
  | 'text-emphasis-position'
  | 'text-emphasis-skip'
  | 'text-emphasis-style'
  | 'text-fit'
  | 'text-group-align'
  | 'text-indent'
  | 'text-justify'
  | 'text-orientation'
  | 'text-overflow'
  | 'text-rendering'
  | 'text-shadow'
  | 'text-size-adjust'
  | 'text-spacing'
  | 'text-spacing-trim'
  | 'text-transform'
  | 'text-underline-offset'
  | 'text-underline-position'
  | 'text-wrap'
  | 'text-wrap-mode'
  | 'text-wrap-style'
  | 'timeline-scope'
  | 'timeline-trigger'
  | 'timeline-trigger-activation-range'
  | 'timeline-trigger-activation-range-end'
  | 'timeline-trigger-activation-range-start'
  | 'timeline-trigger-active-range'
  | 'timeline-trigger-active-range-end'
  | 'timeline-trigger-active-range-start'
  | 'timeline-trigger-name'
  | 'timeline-trigger-range'
  | 'timeline-trigger-source'
  | 'top'
  | 'touch-action'
  | 'transform'
  | 'transform-box'
  | 'transform-origin'
  | 'transform-style'
  | 'transition'
  | 'transition-behavior'
  | 'transition-delay'
  | 'transition-duration'
  | 'transition-property'
  | 'transition-timing-function'
  | 'translate'
  | 'trigger-scope'
  | 'unicode-bidi'
  | 'user-select'
  | 'vector-effect'
  | 'vertical-align'
  | 'view-timeline'
  | 'view-timeline-axis'
  | 'view-timeline-inset'
  | 'view-timeline-name'
  | 'view-transition-class'
  | 'view-transition-group'
  | 'view-transition-name'
  | 'view-transition-scope'
  | 'visibility'
  | 'voice-balance'
  | 'voice-duration'
  | 'voice-family'
  | 'voice-pitch'
  | 'voice-range'
  | 'voice-rate'
  | 'voice-stress'
  | 'voice-volume'
  | 'white-space'
  | 'white-space-collapse'
  | 'white-space-trim'
  | 'widows'
  | 'width'
  | 'will-change'
  | 'window-drag'
  | 'word-break'
  | 'word-space-transform'
  | 'word-spacing'
  | 'word-wrap'
  | 'wrap-after'
  | 'wrap-before'
  | 'wrap-flow'
  | 'wrap-inside'
  | 'wrap-through'
  | 'writing-mode'
  | 'x'
  | 'y'
  | 'z-index'
  | 'zoom';
