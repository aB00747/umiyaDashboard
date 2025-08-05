<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Financial;

class FinancialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing customers
        $customers = Customer::all();

        if ($customers->isEmpty()) {
            $this->command->info('No customers found. Please run CustomerSeeder first.');
            return;
        }

        foreach ($customers as $customer) {
            // Generate realistic financial data for each customer
            $creditLimit = fake()->randomFloat(2, 50000, 1000000);
            $usedCredit = fake()->randomFloat(2, 0, $creditLimit * 0.8);
            $availableCredit = $creditLimit - $usedCredit;
            
            $outstandingAmount = fake()->randomFloat(2, 0, $usedCredit * 0.6);
            $overdueAmount = fake()->randomFloat(2, 0, $outstandingAmount * 0.3);
            
            $totalRevenue = fake()->randomFloat(2, 100000, 5000000);
            $ytdRevenue = fake()->randomFloat(2, $totalRevenue * 0.3, $totalRevenue * 0.8);
            
            Financial::create([
                'customer_id' => $customer->id,
                'credit_limit' => $creditLimit,
                'available_credit' => $availableCredit,
                'used_credit' => $usedCredit,
                'outstanding_amount' => $outstandingAmount,
                'overdue_amount' => $overdueAmount,
                'payment_terms_days' => fake()->randomElement([15, 30, 45, 60]),
                'payment_method' => fake()->randomElement(['cash', 'cheque', 'bank_transfer', 'upi', 'card']),
                'total_revenue' => $totalRevenue,
                'ytd_revenue' => $ytdRevenue,
                'last_year_revenue' => fake()->randomFloat(2, $totalRevenue * 0.5, $totalRevenue * 1.2),
                'average_order_value' => fake()->randomFloat(2, 10000, 200000),
                'total_orders' => fake()->numberBetween(5, 150),
                'ytd_orders' => fake()->numberBetween(2, 50),
                'cancelled_orders' => fake()->numberBetween(0, 10),
                'pending_orders' => fake()->numberBetween(0, 5),
                'discount_percentage' => fake()->randomFloat(2, 0, 25),
                'price_tier' => fake()->randomElement(['standard', 'wholesale', 'premium', 'vip']),
                'last_payment_date' => fake()->dateTimeBetween('-6 months', 'now'),
                'last_order_date' => fake()->dateTimeBetween('-3 months', 'now'),
                'first_order_date' => fake()->dateTimeBetween('-2 years', '-6 months'),
                'credit_status' => fake()->randomElement(['good', 'warning', 'blocked', 'review']),
                'payment_behavior' => fake()->randomElement(['excellent', 'good', 'average', 'poor']),
                'days_since_last_payment' => fake()->numberBetween(0, 90),
                'gst_amount_collected' => fake()->randomFloat(2, 0, $totalRevenue * 0.18),
                'tds_amount_deducted' => fake()->randomFloat(2, 0, $totalRevenue * 0.02),
                'bank_name' => fake()->randomElement([
                    'State Bank of India',
                    'HDFC Bank',
                    'ICICI Bank',
                    'Axis Bank',
                    'Punjab National Bank',
                    'Bank of Baroda',
                    'Canara Bank'
                ]),
                'account_number' => fake()->numerify('################'),
                'ifsc_code' => fake()->regexify('[A-Z]{4}0[A-Z0-9]{6}'),
                'branch_name' => fake()->city() . ' Branch',
                'financial_notes' => fake()->optional(0.3)->sentence(),
                'credit_notes' => fake()->optional(0.2)->sentence(),
            ]);
        }

        $this->command->info('Financial records created for all customers.');
    }
}