var devices = null;
$(() => {
	setInterval(() => {
		getDevices();
	}, 2000);
});

function getDevices() {
	const devicesListUri = "http://localhost:9000/api/device/list";

	$.ajax({
		url: devicesListUri,
		type: "GET",
		success: function (result) {
			const tbodyDevices = $("#tbody-devices");
			tbodyDevices.empty(); // Clear existing device rows
			devices = result.devices;
			result.devices.forEach((device) => {
				const { name, udid, version, status } = device;
				const statusNumber = Number(status);

				let statusText, btnClass, disabled;

				switch (statusNumber) {
					case 0:
						statusText = "Use";
						btnClass = "btn-success"; // Button color for "Use" status
						disabled = "enabled";
						break;
					case 1:
						statusText = "Busy";
						btnClass = "btn-danger"; // Button color for "Busy" status
						disabled = "disabled";
						break;
					default:
						statusText = "Offline";
						btnClass = "btn-secondary"; // Button color for "Offline" status
						disabled = "disabled";
						break;
				}

				const tr = `
                    <tr>
                        <td>${name}</td>
                        <td class="udid">${udid}</td>
                        <td>${version}</td>
                        <td>
                            <button ${disabled} type="button" class="btn ${btnClass}" aria-disabled="${disabled}" onclick="redirectToControl(this)">
                                ${statusText}
                            </button>
                        </td>
                    </tr>`;

				tbodyDevices.append(tr);
			});
		},
		error: function (error) {
			console.error("Error fetching devices:", error);
			if (error.status === 401) {
				window.location.assign("/login");
			} else {
				alert("Failed to fetch devices. Please try again later.");
			}
		},
	});
}

function redirectToControl(element) {
	var $row = $(element).closest("tr");
	var $udid = $row.find(".udid").text();
	const selectedDevice = devices.find((device) => device.udid == $udid);
	const newWindow = window.open("/device.html", "_blank");
	newWindow.addEventListener("load", () => {
		newWindow.postMessage(selectedDevice, "*");
	});
}
