import classNames from "classnames";
import { link, linkOff } from "@wordpress/icons";
const { __, _x } = wp.i18n;
const { Fragment, useState } = wp.element;
const { InspectorControls, InspectorAdvancedControls, InnerBlocks, BlockControls } = wp.blockEditor;
const {
	PanelBody,
	SelectControl,
	ToggleControl,
	__experimentalUnitControl: UnitControl,
	Flex,
	FlexItem,
	Button,
	Tooltip,
	BaseControl,
} = wp.components;

// import { Visualizer } from "../../components/panel-spacing";
import { BlockControlsBlockAppender } from "../../components/block-controls-block-appender";
import { ResponsiveTabs } from "../../components/responsive-tabs";
import { BlockFlexItemsAlignmentToolbar, BlockContentJustificationToolbar } from "../../components/alignment";
import { toNumber } from "../../_common";

import { rowClassNames } from "./render";
import { DEFAULT_ATTRIBUTES } from "./metadata";
import { name as rowBreakBlockName } from "./row-break";
import { name as columnBlockName } from "../column/metadata";

const ROW_CHILDREN_LABEL = __("columns", "gutestrap");

const generateRowColumnsOptions = (gridRowCols = 6) => {
	const opts = [];
	for (let count = 1; count <= gridRowCols; count++) {
		opts.push({
			label: `1/${count}`,
			value: count,
		});
	}
	return opts;
};
const ROW_COLS_OPTIONS = generateRowColumnsOptions();

const INHERIT_OPTION = {
	label: __("Inherit from smaller (default)", "gutestrap"),
	value: 0,
};

const COLS_AUTO_OPTION = {
	label: __("Equal-width (default)", "gutestrap"),
	value: 0,
};

const ROW_JUSTIFICATION_OPTIONS = [
	{
		label: __("Inherit from smaller (default)", "gutestrap"),
		value: "inherit",
	},
	{
		label: _x("Pack columns to the left", "Row columns justification setting", "gutestrap"),
		value: "start",
	},
	{
		label: _x("Pack columns in the centre", "Row columns justification setting", "gutestrap"),
		value: "center",
	},
	{
		label: _x("Pack columns to the right", "Row columns justification setting", "gutestrap"),
		value: "end",
	},
	{
		label: _x("Distribute columns horizontally", "Row columns justification setting", "gutestrap"),
		value: "between",
	},
	{
		label: _x("Distribute columns with equal spacing on each end", "Row columns justification setting", "gutestrap"),
		value: "evenly",
	},
	{
		label: _x(
			"Distribute columns with half-size spacing on each end",
			"Row columns justification setting",
			"gutestrap"
		),
		value: "around",
	},
];
const ROW_JUSTIFICATION_OPTIONS_XS = [
	{
		label: _x("Pack columns to the left (default)", "Row columns justification setting", "gutestrap"),
		value: "start",
	},
	...ROW_JUSTIFICATION_OPTIONS.slice(2),
];

const ROW_ALIGNMENT_OPTIONS = [
	{
		label: __("Inherit from smaller (default)", "gutestrap"),
		value: "inherit",
	},
	{
		label: __("Stretch", "gutestrap"),
		value: "stretch",
	},
	{
		label: __("Top", "gutestrap"),
		value: "start",
	},
	{
		label: __("Center", "gutestrap"),
		value: "center",
	},
	{
		label: __("Bottom", "gutestrap"),
		value: "end",
	},
	{
		label: __("Baseline", "gutestrap"),
		value: "baseline",
	},
];

const ROW_ALIGNMENT_OPTIONS_XS = [
	{
		label: __("Stretch (default)", "gutestrap"),
		value: "stretch",
	},
	...ROW_ALIGNMENT_OPTIONS.slice(2),
];

const ROW_DIRECTION_OPTIONS = [
	{
		label: __("Inherit from smaller (default)", "gutestrap"),
		value: "inherit",
	},
	{
		label: __("Normal", "gutestrap"),
		value: "row",
	},
	{
		label: __("Reversed", "gutestrap"),
		value: "row-reverse",
	},
];

/**
 * The edit function describes the structure of your block in the context of the editor.
 * This represents what the editor will render when the block is used.
 *
 * The "edit" property must be a valid function.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
 *
 * @param {Object} props Props.
 * @returns {Mixed} JSX Component.
 */
export const RowEdit = (props) => {
	const { attributes, className, setAttributes, clientId } = props;
	const {
		defaultColWidth = {},
		alignment = {},
		direction = {},
		justification = {},
		padding = {},
		noGutters,
		verticalGutters,
		disabled,
	} = attributes;
	const [isPaddingLinked, setIsPaddingLinked] = useState(padding?.top === padding?.bottom);

	return (
		<Fragment>
			<BlockControls>
				<BlockContentJustificationToolbar
					label={ROW_CHILDREN_LABEL}
					value={justification.xs}
					onChange={(value) => {
						justification.xs = value;
						setAttributes({ justification: { ...justification } });
					}}
				/>
				<BlockFlexItemsAlignmentToolbar
					label={ROW_CHILDREN_LABEL}
					value={alignment.xs}
					controls={["stretch", "start", "center", "end", "baseline"]}
					onChange={(value) => {
						alignment.xs = value;
						setAttributes({ alignment: { ...alignment } });
					}}
				/>
			</BlockControls>
			<InspectorControls>
				<ResponsiveTabs
					hasNotification={(bp) => {
						if (bp === "xs") return false;
						return (
							defaultColWidth[bp] ||
							(alignment[bp] && alignment[bp] !== "inherit") ||
							(justification[bp] && justification[bp] !== "inherit") ||
							(direction[bp] && direction[bp] !== "inherit")
						);
					}}
				>
					{(tab) => {
						const { label, breakpoint } = tab;
						const canInherit = breakpoint !== "xs";
						return (
							<PanelBody>
								<p>{`${label} layout`}</p>
								<SelectControl
									label={__("Default column width", "gutestrap")}
									options={[canInherit ? INHERIT_OPTION : COLS_AUTO_OPTION, ...ROW_COLS_OPTIONS]}
									value={
										defaultColWidth[breakpoint] != null
											? defaultColWidth[breakpoint]
											: DEFAULT_ATTRIBUTES.defaultColWidth[breakpoint]
									}
									onChange={(value) => {
										defaultColWidth[breakpoint] = toNumber(value);
										setAttributes({ defaultColWidth: { ...defaultColWidth } });
									}}
								/>
								<SelectControl
									label={__("Distribute columns", "gutestrap")}
									options={canInherit ? ROW_JUSTIFICATION_OPTIONS : ROW_JUSTIFICATION_OPTIONS_XS}
									value={
										justification[breakpoint] != null
											? justification[breakpoint]
											: DEFAULT_ATTRIBUTES.justification[breakpoint]
									}
									onChange={(value) => {
										justification[breakpoint] = value;
										setAttributes({ justification: { ...justification } });
									}}
								/>
								<SelectControl
									label={__("Align columns", "gutestrap")}
									options={canInherit ? ROW_ALIGNMENT_OPTIONS : ROW_ALIGNMENT_OPTIONS_XS}
									value={
										alignment[breakpoint] != null ? alignment[breakpoint] : DEFAULT_ATTRIBUTES.alignment[breakpoint]
									}
									onChange={(value) => {
										alignment[breakpoint] = value;
										setAttributes({ alignment: { ...alignment } });
									}}
								/>
								<SelectControl
									label={__("Row direction", "gutestrap")}
									options={
										canInherit
											? ROW_DIRECTION_OPTIONS
											: [
													{
														label: __("Normal (Default)", "gutestrap"),
														value: "row",
													},
													ROW_DIRECTION_OPTIONS[2],
											  ]
									}
									value={
										direction[breakpoint] != null ? direction[breakpoint] : DEFAULT_ATTRIBUTES.direction[breakpoint]
									}
									onChange={(value) => {
										direction[breakpoint] = value;
										setAttributes({ direction: { ...direction } });
									}}
								/>
							</PanelBody>
						);
					}}
				</ResponsiveTabs>
				<PanelBody
					title={__("Spacing", "gutestrap")}
					initialOpen={!!(parseFloat(padding?.top) || parseFloat(padding?.bottom))}
				>
					<BaseControl
						label={__("Padding", "gutestrap")}
						className={isPaddingLinked ? "spacing-linked" : "spacing-not-linked"}
					>
						<Flex align={"flex-end"}>
							<FlexItem>
								<Flex>
									<FlexItem>
										<UnitControl
											className="spacing-unit-control"
											label={isPaddingLinked ? __("Top and bottom", "gutestrap") : __("Top", "gutestrap")}
											size="small"
											value={padding?.top}
											onChange={(value) => {
												padding.top = value;
												if (isPaddingLinked) {
													padding.bottom = value;
												}
												setAttributes({ padding: { ...padding } });
											}}
										/>
									</FlexItem>
									{!isPaddingLinked && (
										<FlexItem>
											<UnitControl
												className="spacing-unit-control"
												label={__("Bottom", "gutestrap")}
												size="small"
												value={padding?.bottom}
												onChange={(value) => {
													padding.bottom = value;
													setAttributes({ padding: { ...padding } });
												}}
											/>
										</FlexItem>
									)}
								</Flex>
							</FlexItem>
							<FlexItem style={{ marginLeft: "auto" }}>
								<Tooltip text={isPaddingLinked ? __("Unlink sides", "gutestrap") : __("Link sides", "gutestrap")}>
									<span>
										<Button
											onClick={() => setIsPaddingLinked((state) => !state)}
											className="spacing-linked-button"
											isPrimary={isPaddingLinked}
											isSecondary={!isPaddingLinked}
											isSmall
											icon={isPaddingLinked ? link : linkOff}
											iconSize={16}
										/>
									</span>
								</Tooltip>
							</FlexItem>
						</Flex>
					</BaseControl>
				</PanelBody>
				<PanelBody title={__("Gutters", "gutestrap")} initialOpen={false}>
					<ToggleControl
						checked={!noGutters}
						// help={__("Add gutters between the columns of this row.", "gutestrap")}
						label={__("Horizontal gutters", "gutestrap")}
						onChange={(checked) => {
							setAttributes({ noGutters: !checked });
						}}
					/>
					<ToggleControl
						checked={!!verticalGutters}
						// help={__("Add gutters between the lines of columns of this row.", "gutestrap")}
						label={__("Vertical gutters", "gutestrap")}
						onChange={(checked) => {
							setAttributes({ verticalGutters: !!checked });
						}}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<ToggleControl
					label={__("Disable block", "gutestrap")}
					help={__("Prevent this block and its contents from rendering.", "gutestrap")}
					checked={disabled}
					onChange={(checked) => {
						setAttributes({ disabled: !!checked });
					}}
				/>
			</InspectorAdvancedControls>
			{/* <Visualizer values={padding}> */}
			<div
				className={classNames(className, rowClassNames(attributes))}
				style={{
					paddingTop: padding?.top,
					paddingBottom: padding?.bottom,
				}}
			>
				<InnerBlocks
					allowedBlocks={[rowBreakBlockName, columnBlockName]}
					orientation="horizontal"
					renderAppender={() => {
						return (
							<Fragment>
								<BlockControlsBlockAppender rootClientId={clientId} />
								<InnerBlocks.ButtonBlockAppender />
							</Fragment>
						);
					}}
				/>
			</div>
			{/* </Visualizer> */}
		</Fragment>
	);
};
