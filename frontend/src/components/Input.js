export const Input = ({ type, name, placeholder, value, onChange }) => (
	<div className="input-box">
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			required
			value={value}
			onChange={onChange}
		/>
	</div>
);
