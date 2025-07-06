<?php

namespace App\Traits;

use App\Models\AdminActivity;

trait AdminActivityLogger
{
    /**
     * Ghi log khi tạo mới
     */
    protected function logCreate($modelName, $data = null)
    {
        $description = "Admin đã thêm {$modelName} mới";
        if ($data) {
            $description .= " - " . json_encode($data);
        }
        AdminActivity::log($description);
    }

    /**
     * Ghi log khi cập nhật
     */
    protected function logUpdate($modelName, $id, $data = null)
    {
        $description = "Admin đã cập nhật {$modelName} ID: {$id}";
        if ($data) {
            $description .= " - " . json_encode($data);
        }
        AdminActivity::log($description);
    }

    /**
     * Ghi log khi xóa
     */
    protected function logDelete($modelName, $id)
    {
        $description = "Admin đã xóa {$modelName} ID: {$id}";
        AdminActivity::log($description);
    }
}
