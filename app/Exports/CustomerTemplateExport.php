<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CustomerTemplateExport implements FromArray, WithHeadings, WithStyles
{
    /**
     * @return array
     */
    public function array(): array
    {
        // Sample data row (optional)
        return [
            [
                'John',
                'Doe',
                'ABC Company',
                '123 Main St',
                'Suite 101',
                'Mumbai',
                'Maharashtra',
                'MH',
                'India',
                'IN',
                '400001',
                '+91 9876543210',
                '+91 9876543211',
                'john@example.com',
                'GSTIN12345678',
                'ABCDE1234F',
                'Corporate',
                'Yes'
            ]
        ];
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'First Name',
            'Last Name',
            'Company Name',
            'Address Line 1',
            'Address Line 2',
            'City',
            'State',
            'State Code',
            'Country',
            'Country Code',
            'PIN Code',
            'Phone',
            'Alternate Phone',
            'Email',
            'GSTIN',
            'PAN',
            'Customer Type',
            'Is Active'
        ];
    }

    /**
     * @param Worksheet $sheet
     */
    public function styles(Worksheet $sheet)
    {
        // Style the header row
        $sheet->getStyle('A1:R1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4F46E5'], // Indigo color
            ],
        ]);

        // Add notes for required fields
        $sheet->getComment('A1')->getText()->createTextRun('Required if Company Name is empty');
        $sheet->getComment('C1')->getText()->createTextRun('Required if First Name is empty');
        $sheet->getComment('D1')->getText()->createTextRun('Required');

        // Auto-size columns
        foreach (range('A', 'R') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
    }
}
