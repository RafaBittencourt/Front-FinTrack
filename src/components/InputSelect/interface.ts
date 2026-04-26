export interface IInputSelect {
	selectOptions: {
		value: string
		display: string
	}[]
	defaultValue?: string
	name: string
	label: string
	className?: string
	disabled?: boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: any
}