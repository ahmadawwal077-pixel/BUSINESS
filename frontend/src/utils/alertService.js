import Swal from "sweetalert2";

const alertService = {
	/**
	 * Show a success alert
	 * @param {string} title
	 * @param {string} text
	 */
	success: (title, text = "") => {
		return Swal.fire({
			icon: "success",
			title: title,
			text: text,
			confirmButtonColor: "#0066cc",
			timer: 3000,
			timerProgressBar: true,
			showConfirmButton: false,
		});
	},

	/**
	 * Show an error alert
	 * @param {string} title
	 * @param {string} text
	 */
	error: (title, text = "") => {
		return Swal.fire({
			icon: "error",
			title: title,
			text: text,
			confirmButtonColor: "#0066cc",
		});
	},

	/**
	 * Show a confirmation dialog
	 * @param {string} title
	 * @param {string} text
	 * @param {string} confirmButtonText
	 */
	confirm: (title, text = "", confirmButtonText = "Yes, proceed") => {
		return Swal.fire({
			title: title,
			text: text,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#0066cc",
			cancelButtonColor: "#6b7280",
			confirmButtonText: confirmButtonText,
			background: "#fff",
			borderRadius: "15px",
		});
	},

	/**
	 * Show an info alert
	 * @param {string} title
	 * @param {string} text
	 */
	info: (title, text = "") => {
		return Swal.fire({
			icon: "info",
			title: title,
			text: text,
			confirmButtonColor: "#0066cc",
		});
	},
};

export default alertService;
