<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Country
 *
 * This model represents a country entity in the application.
 * It is used for managing country-related data and interactions.
 */
class Words extends Model
{
    protected $table = 'words';

    public static function snakeToNormal($string)
    {
        $string = str_replace('_', ' ', $string);        // Replace underscores with spaces
        $string = ucwords($string);                      // Capitalize the first letter of each word
        return $string;
    }
}
