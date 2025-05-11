<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $verificationUrl;

    /**
     * Create a new message instance.
     *
     * @param string $url
     */
    public function __construct($url)
    {
        $this->verificationUrl = $url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Verify Your Email Address')
                    ->view('emails.verify') // View blade
                    ->with([
                        'url' => $this->verificationUrl
                    ]);
    }
}