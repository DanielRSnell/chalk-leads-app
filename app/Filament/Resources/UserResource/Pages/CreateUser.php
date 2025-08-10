<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Hash password for new users
        if (filled($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        // Set email as verified for admin-created users
        $data['email_verified_at'] = now();
        
        return $data;
    }
}
