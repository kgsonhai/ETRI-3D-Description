import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';
import React from 'react';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { data, type Description } from './makeData';


const columnHelper = createMRTColumnHelper<Description>();

const COLORS = ['red', '#3D9970', 'royalblue'];

function renderSegment(segment: string, color: string, idx: number) {
  // Regex để tìm các cụm trong {}
  const regex = /{(.*?)}/g;
  const parts = segment.split(regex);

  return (
    <span key={idx} style={{ color, fontWeight: 400 }}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            style={{
              color,
              fontWeight: 700,
              textDecoration: 'underline',
              margin: 0,
              padding: 0,
            }}
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

const renderDescription = (text: string) => {
  // Cắt thành 3 đoạn (hoặc ít hơn nếu thiếu dấu ;)
  const segments = text.split(';').map(s => s.trim());
  // Hiển thị từng đoạn với màu tương ứng
  return (
    <span>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          {renderSegment(seg, COLORS[i] || COLORS[COLORS.length - 1], i)}
          {i < segments.length - 1 && <span>; </span>}
        </React.Fragment>
      ))}
    </span>
  );
};


const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 10,
  }),
  columnHelper.accessor('actionName', {
    header: 'Action Name',
    size: 150,
    enableSorting: false,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    Cell: ({ cell }) => renderDescription(cell.getValue()),
    size: 300,
    enableSorting: false,
    muiTableBodyCellProps: {
      sx: {
        textAlign: 'justify',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
      },
    },
  }),
];

const Example = () => {
  const handleExportRows = (rows: MRT_Row<Description>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('mrt-pdf-example.pdf');
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    enableColumnActions: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableGlobalFilter: false, // ❌ Tắt thanh tìm kiếm
    enableDensityToggle: false, // ❌ Tắt nút đổi mật độ dòng
    enableFullScreenToggle: false, // ❌ Tắt nút fullscreen
    enableHiding: false,
    muiTableContainerProps: {
      sx: {
        border: '1px solid #ccc',
        borderRadius: '6px',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid #ddd',
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export PDF file
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
