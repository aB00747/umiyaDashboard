<?php
// app/Notifications/NewOrderNotification.php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NewOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New Order Received',
            'message' => "Order #{$this->order->id} has been placed",
            'order_id' => $this->order->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'data' => [
                'title' => 'New Order Received',
                'message' => "Order #{$this->order->id} has been placed",
                'order_id' => $this->order->id,
            ],
            'created_at' => now()->toIso8601String(),
            'read_at' => null
        ]);
    }
}