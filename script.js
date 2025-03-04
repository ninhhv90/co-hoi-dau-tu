$(document).ready(function () {
    let table = $('#stockTable').DataTable({
        columns: [
            { data: 'Mã CK' },
            { data: 'Tên công ty' },
            { data: 'Sàn' },
            { data: 'Giá' },
            { data: 'EPS' },
            { data: 'P/E' }
        ],
        pageLength: 10,
        language: {
            search: "Tìm kiếm:",
            lengthMenu: "Hiển thị _MENU_ cổ phiếu mỗi trang",
            info: "Hiển thị _START_ đến _END_ trong _TOTAL_ cổ phiếu",
            paginate: {
                first: "Đầu",
                last: "Cuối",
                next: "Tiếp",
                previous: "Trước"
            }
        }
    });

    function fetchStockData() {
        const spreadsheetId = '1ZCrAgbbSFc6T5uFuI75R-rQxtVAsFSWGiBzFDrh5cEg';
        const apiKey = 'AIzaSyDkbOAdPSdoWK0MrKyp775XqAxHWrhlAkA'; // Thay bằng API Key của bạn
        const range = 'DASHBOARD!A1:Z';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        $.getJSON(url, function (response) {
            const headers = response.values[0];
            const rows = response.values.slice(1);

            const data = rows.map(row => {
                let obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });

            table.clear();
            table.rows.add(data);
            table.draw();

            const now = new Date().toLocaleString('vi-VN');
            $('#lastUpdated').text(`Cập nhật lần cuối: ${now}`);
        }).fail(function (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            $('#lastUpdated').text('Lỗi tải dữ liệu, vui lòng thử lại!');
        });
    }

    fetchStockData();
    setInterval(fetchStockData, 300000); // Cập nhật mỗi 5 phút
});
