/**
 * BLOCK: gutestrap
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

const { __ } = wp.i18n;
const { createHigherOrderComponent } = wp.compose;
import classNames from "classnames";

import BreakIcon from "./break-icon.svg";
import { name as rowBlockName } from "../metadata";

export const name = "gutestrap/row-break";

export const title = __("Row Break", "gutestrap");

export const description = __("Row breaks will cause any following columns to start on a new line.", "gutestrap");

/** @type {string[]} Allowed parent blocks. */
export const parent = [rowBlockName];

export const save = ({ className }) => {
	return <div className={classNames("w-100", className)} aria-hidden="true" />;
};

export const edit = ({ className }) => {
	return (
		<div className={classNames("w-100", className)} aria-hidden="true">
			<BreakIcon width="24" height="24" className="bi bi-row-break-icon" />
		</div>
	);
};

// /** Supported WordPress/Gutenberg features. */
// export const supports = {
// 	anchor: true,
// };

export { BreakIcon as icon };

export default { name, settings: { title, icon: BreakIcon, description, parent, edit, save } };

wp.hooks.addFilter(
	"editor.BlockListBlock",
	"gutestrap/with-row-break-block-list-block-classes",
	createHigherOrderComponent((BlockListBlock) => {
		/**
		 * @arg {Object} props - Props.
		 * @arg {Object} props.attributes - Block attributes.
		 * @arg {Object} props.block - Block properties.
		 * @arg {string} props.block.name - Block name.
		 * @returns {*} JSX
		 */
		const gutestrapRowBreakBlockListBlockClasses = ({ className, ...props }) => {
			const { block } = props;
			if (block.name === name) {
				className = classNames(className, "w-100");
			}
			return <BlockListBlock {...props} className={className} />;
		};
		return gutestrapRowBreakBlockListBlockClasses;
	}, "withGutestrapRowBreakBlockListBlockClasses")
);
