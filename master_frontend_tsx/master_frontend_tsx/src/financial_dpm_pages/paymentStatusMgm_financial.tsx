import React, { useState, useEffect } from 'react';
import { ThemeLayout } from "../styles/theme_layout.tsx";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { User } from "../types";

// Define the PaymentHistory type representing individual payment transactions.
interface PaymentHistory {
    id: number;
    date: string;
    amount: number;
    method: string;
}

// Updated Invoice type with payment history included.
interface Invoice {
    id: number;
    studentName: string;
    semester: string;
    year: number;
    status: 'Pending' | 'Validated';
    paymentHistory: PaymentHistory[];
}

// Props definition for the Financial page component.
interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function PaymentStatusMgm({ onLogout }: FinancialPageProps) {
    // State to hold invoice data.
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    // State for managing search queries.
    const [searchQuery, setSearchQuery] = useState('');
    // State to manage expanded rows for showing payment history.
    const [expandedRows, setExpandedRows] = useState<{ [invoiceId: number]: boolean }>({});

    // Simulate fetching invoice data, including payment history for each invoice.
    useEffect(() => {
        const fetchedInvoices: Invoice[] = [
            {
                id: 1,
                studentName: 'John Doe',
                semester: 'Fall',
                year: 2024,
                status: 'Pending',
                paymentHistory: [
                    {id: 101, date: '2024-09-01', amount: 500, method: 'Credit Card'},
                    {id: 102, date: '2024-09-15', amount: 250, method: 'Bank Transfer'},
                ]
            },
            {
                id: 2,
                studentName: 'Jane Smith',
                semester: 'Spring',
                year: 2024,
                status: 'Validated',
                paymentHistory: [
                    {id: 103, date: '2024-02-10', amount: 750, method: 'Debit Card'}
                ]
            },
            {
                id: 3,
                studentName: 'Alice Johnson',
                semester: 'Fall',
                year: 2023,
                status: 'Pending',
                paymentHistory: [
                    {id: 104, date: '2023-09-05', amount: 600, method: 'Credit Card'}
                ]
            },
            {
                id: 4,
                studentName: 'Bob Brown',
                semester: 'Spring',
                year: 2023,
                status: 'Validated',
                paymentHistory: [
                    {id: 105, date: '2023-03-12', amount: 800, method: 'Bank Transfer'}
                ]
            },
            // More dummy data can be added here.
        ];
        setInvoices(fetchedInvoices);
    }, []);

    // Function to group invoices by year.
    const groupInvoicesByYear = (invoicesList: Invoice[]) => {
        return invoicesList.reduce((groups: Record<number, Invoice[]>, invoice) => {
            if (!groups[invoice.year]) {
                groups[invoice.year] = [];
            }
            groups[invoice.year].push(invoice);
            return groups;
        }, {});
    };

    // Filter invoices based on the search query.
    const filteredInvoices = invoices.filter(invoice =>
        invoice.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.semester.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.year.toString().includes(searchQuery)
    );

    // Group the filtered invoices by year.
    const groupedInvoices = groupInvoicesByYear(filteredInvoices);

    // Function to handle payment validation.
    const handleValidatePayment = (invoiceId: number) => {
        // API call simulation to update the invoice status.
        setInvoices(prevInvoices =>
            prevInvoices.map(invoice =>
                invoice.id === invoiceId ? {...invoice, status: 'Validated'} : invoice
            )
        );
    };

    // Toggle the visibility of the payment history for a given invoice.
    const toggleHistory = (invoiceId: number) => {
        setExpandedRows(prev => ({
            ...prev,
            [invoiceId]: !prev[invoiceId],
        }));
    };

    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
            <div className="p-4 gap-y-6">
                <Typography variant="h4">
                    Quản lý tình trạng thanh toán của học sinh
                </Typography>
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                />
                {Object.keys(groupedInvoices)
                    .sort((a, b) => Number(b) - Number(a))
                    .map(year => (
                        <div key={year} className="mb-8">
                            <Typography variant="h5" className="mb-2">
                                Năm {year}
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell/>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Tên học sinh</TableCell>
                                            <TableCell>Học kỳ</TableCell>
                                            <TableCell>Trạng thái thanh toán</TableCell>
                                            <TableCell>Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {groupedInvoices[Number(year)].map((invoice) => (
                                            <React.Fragment key={invoice.id}>
                                                <TableRow>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => toggleHistory(invoice.id)}
                                                        >
                                                            {expandedRows[invoice.id] ? (
                                                                <KeyboardArrowUpIcon/>
                                                            ) : (
                                                                <KeyboardArrowDownIcon/>
                                                            )}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{invoice.id}</TableCell>
                                                    <TableCell>{invoice.studentName}</TableCell>
                                                    <TableCell>{invoice.semester}</TableCell>
                                                    <TableCell>{invoice.status}</TableCell>
                                                    <TableCell>
                                                        {invoice.status === 'Pending' && (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleValidatePayment(invoice.id)}
                                                            >
                                                                Xác nhận thanh toán
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                                                        <Collapse in={expandedRows[invoice.id]} timeout="auto"
                                                                  unmountOnExit>
                                                            <div className="p-2">
                                                                <Typography variant="subtitle1" gutterBottom>
                                                                    Lịch sử thanh toán
                                                                </Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>ID</TableCell>
                                                                            <TableCell>Ngày</TableCell>
                                                                            <TableCell>Số tiền</TableCell>
                                                                            <TableCell>Phương thức</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {invoice.paymentHistory.map((payment) => (
                                                                            <TableRow key={payment.id}>
                                                                                <TableCell>{payment.id}</TableCell>
                                                                                <TableCell>{payment.date}</TableCell>
                                                                                <TableCell>{payment.amount}</TableCell>
                                                                                <TableCell>{payment.method}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    ))}
            </div>
        </ThemeLayout>
    )
};
                {/*
          Note: For handling a large number of invoices and associated payment histories,
          consider implementing server-side pagination, data virtualization (e.g., using react-window),
          and indexing strategies in your backend database.
        */}
