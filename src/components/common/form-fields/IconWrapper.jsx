import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

/**
 * Icon
 *
 * @visibleName
 * @see Added: v6.2.0, Last updated: v6.2.0
 */
const IconWrapper = ({
  size,
  type,
  viewbox,
  title,
  className,
  children,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`0 0 ${viewbox} ${viewbox}`}
    className={classnames("svg-icon", `svg-icon-${type}`, className)}
    width={size || `${viewbox}px`}
    height={size || `${viewbox}px`}
    aria-label={title}
    aria-hidden={!title}
    {...props}
  >
    {children}
  </svg>
);

IconWrapper.propTypes = {
  /**
   * Will override the default sizes (default: 18px and lg: 32px). Must include unit ie `24px`.
   *
   * Can be different unit types other than 'px' eg: `em`, `rem`, `%`, `pt`, `vh` etc.
   * @since Version 6.0.0
   */
  size: PropTypes.string,
  /**
   * If title is added aria-hidden="true" is replaced with aria-label="title", to better discribe the element for screen readers.
   * @since Version 6.0.0
   */
  title: PropTypes.string,
  /**
   * Specify your own classname into this prop, if you need to customise layout of this component.
   * This classname will be put into the parent container of this component.
   * @since Version 6.0.0
   */
  className: PropTypes.string,
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  type: PropTypes.string,
  /**
   * @ignore
   */
  viewbox: PropTypes.number.isRequired
};

IconWrapper.defaultProps = {
  size: undefined,
  title: undefined,
  type: undefined,
  className: undefined,
  children: undefined
};

export default IconWrapper;
