const { __, sprintf } = wp.i18n;
const { SelectControl, ToggleControl, PanelBody } = wp.components;
const { Fragment, useEffect } = wp.element;
import { MediaSelectControl } from "./media-select-control";
import { useStateProp } from "./hooks";

const instructions = (attr) => (
	<p>{sprintf(__("To edit the %s, you need permission to upload media.", "gutestrap"), attr)}</p>
);

const positionOptions = [
	{
		label: __("Center (default)", "gutestrap"),
		value: "center",
	},
	{
		label: __("Top", "gutestrap"),
		value: "top",
	},
	{
		label: __("Bottom", "gutestrap"),
		value: "bottom",
	},
	{
		label: __("Left", "gutestrap"),
		value: "left",
	},
	{
		label: __("Right", "gutestrap"),
		value: "right",
	},
	{
		label: __("Top left", "gutestrap"),
		value: "top left",
	},
	{
		label: __("Top right", "gutestrap"),
		value: "top right",
	},
	{
		label: __("Bottom left", "gutestrap"),
		value: "bottom left",
	},
	{
		label: __("Bottom right", "gutestrap"),
		value: "bottom right",
	},
	// {
	// 	label: __("Custom", "gutestrap"),
	// 	value: "custom",
	// },
];

const sizeOptions = [
	{ label: __("Cover (default)", "gutestrap"), value: "cover" },
	{ label: __("Contain", "gutestrap"), value: "contain" },
	{ label: __("Auto", "gutestrap"), value: "auto" },
	// { label: __("Custom", "gutestrap"), value: "custom" },
];

// const positionOptionValues = positionOptions.map(({ value }) => value);

export const PanelBackgroundImage = ({ initialOpen = true, value = {}, onChange = (_value) => {} }) => {
	const [image, setImage] = useStateProp(value.image);
	const [position, setPosition] = useStateProp(value.position);
	// const [customPosition, setCustomPosition] = useStateProp(value.position);
	const [size, setSize] = useStateProp(value.size);
	const [repeat, setRepeat] = useStateProp(value.repeat);

	useEffect(() => {
		// const positionValue ;
		onChange({ image, position, size, repeat });
	}, [image, position, size, repeat]);

	return (
		<PanelBody title={__("Background Image", "gutestrap")} initialOpen={initialOpen}>
			<MediaSelectControl
				value={image}
				allowedTypes="image"
				onSelect={setImage}
				onRemove={() => setImage(null)}
				fallback={instructions(__("background image", "gutestrap"))}
				editText={__("Replace", "gutestrap")}
				removeText={__("Remove", "gutestrap")}
			/>
			{image && (
				<Fragment>
					<SelectControl label={__("Position")} options={positionOptions} value={position} onChange={setPosition} />
					{/* TODO: CUSTOM POSITION */}
					<SelectControl label={__("Size")} options={sizeOptions} value={size} onChange={setSize} />
					{/* TODO: CUSOTM SIZING */}
					<ToggleControl
						checked={repeat}
						onChange={(checked) => setRepeat(!!checked)}
						label={__("Tile image", "gutestrap")}
					/>
					{/* TODO: background clip */}
					{/* TODO: background attachment */}
				</Fragment>
			)}
		</PanelBody>
	);
};

export function getBackgroundStyle(background) {
	if (!background?.image?.url) return "";
	const { image, position = "center", size = "cover" } = background;
	return `url(${image.url}) ${position}/${size} no-repeat`;
}
