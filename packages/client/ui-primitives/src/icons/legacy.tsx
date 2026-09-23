/**
 * Pre-rename numeric icon names, re-exported as size-preserving wrappers.
 *
 * The size-neutral rename removed every numeric-suffixed export while client
 * bundles published against the older barrel still `require` these names
 * through the shell module table; a missing name reaches React as an
 * undefined component type and blanks the panel that renders it. Each wrapper
 * forwards to its `Regular` counterpart and keeps the numeric suffix as the
 * default size — the old components' exact contract — so a prebuilt bundle
 * renders unchanged. Repository code imports `Regular` or `Medium` instead.
 * @module
 */

import type { IconProps } from './props.ts'
import {
  IconCheckOutlineRegular, IconChevronDownOutlineRegular, IconChevronLeftOutlineRegular,
  IconChevronRightOutlineRegular, IconChevronUpOutlineRegular, IconCodeOutlineRegular,
  IconCordisPluginOutlineRegular, IconDownloadOutlineRegular, IconFolderOpenRegular,
  IconFullscreenOutlineRegular, IconLinkOutlineRegular, IconLoadingOutlineRegular,
  IconQuestionOutlineRegular, IconRefreshOutlineRegular, IconSearchOutlineRegular,
  IconSparkleRegular, IconWarningOutlineRegular,
} from './index.tsx'

/**
 * Legacy alias for {@link IconCheckOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the check glyph as an svg element.
 */
export const IconCheckOutline16 = (props: IconProps) => (
  <IconCheckOutlineRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconChevronDownOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the down chevron as an svg element.
 */
export const IconChevronDownOutline14 = (props: IconProps) => (
  <IconChevronDownOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconChevronLeftOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the left chevron as an svg element.
 */
export const IconChevronLeftOutline14 = (props: IconProps) => (
  <IconChevronLeftOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconChevronRightOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the right chevron as an svg element.
 */
export const IconChevronRightOutline14 = (props: IconProps) => (
  <IconChevronRightOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconChevronUpOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the up chevron as an svg element.
 */
export const IconChevronUpOutline14 = (props: IconProps) => (
  <IconChevronUpOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconCodeOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the code glyph as an svg element.
 */
export const IconCodeOutline16 = (props: IconProps) => (
  <IconCodeOutlineRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconCordisPluginOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the plugin glyph as an svg element.
 */
export const IconCordisPluginOutline14 = (props: IconProps) => (
  <IconCordisPluginOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconDownloadOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the download glyph as an svg element.
 */
export const IconDownloadOutline16 = (props: IconProps) => (
  <IconDownloadOutlineRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconFolderOpenRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the open-folder glyph as an svg element.
 */
export const IconFolderOpen16 = (props: IconProps) => (
  <IconFolderOpenRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconFullscreenOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the fullscreen glyph as an svg element.
 */
export const IconFullscreenOutline16 = (props: IconProps) => (
  <IconFullscreenOutlineRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconLinkOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the link glyph as an svg element.
 */
export const IconLinkOutline14 = (props: IconProps) => (
  <IconLinkOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconLoadingOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the loading glyph as an svg element.
 */
export const IconLoadingOutline16 = (props: IconProps) => (
  <IconLoadingOutlineRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconQuestionOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the question glyph as an svg element.
 */
export const IconQuestionOutline14 = (props: IconProps) => (
  <IconQuestionOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconRefreshOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 14.
 * @returns the refresh glyph as an svg element.
 */
export const IconRefreshOutline14 = (props: IconProps) => (
  <IconRefreshOutlineRegular {...props} size={props.size ?? 14} />
)

/**
 * Legacy alias for {@link IconSearchOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the search glyph as an svg element.
 */
export const IconSearchOutline16 = (props: IconProps) => (
  <IconSearchOutlineRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconSparkleRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the sparkle glyph as an svg element.
 */
export const IconSparkle16 = (props: IconProps) => (
  <IconSparkleRegular {...props} size={props.size ?? 16} />
)

/**
 * Legacy alias for {@link IconWarningOutlineRegular}.
 * @param props - glyph size and class; an absent `size` renders at 16.
 * @returns the warning glyph as an svg element.
 */
export const IconWarningOutline16 = (props: IconProps) => (
  <IconWarningOutlineRegular {...props} size={props.size ?? 16} />
)
