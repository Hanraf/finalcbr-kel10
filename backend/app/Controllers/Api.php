<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\BaseCaseModel;
use App\Models\SiswaModel;
use App\Models\PernyataanSiswaModel;
use App\Models\PernyataanModel;
use App\Models\KasusModel;
use App\Models\MinatBakatModel;
use CodeIgniter\API\ResponseTrait;

class Api extends BaseController
{
    use ResponseTrait;

    protected $db;

    public function __construct()
    {
        // Load database service
        $this->db = \Config\Database::connect();
        header('Access-Control-Allow-Origin: *'); //for allow any domain, insecure
        header('Access-Control-Allow-Headers: *'); //for allow any headers, insecure
        header("Content-Type: *");
        header('Access-Control-Allow-Methods: *'); //method allowed
    }

    public function index()
    {
        // Deklarasi models
        $basecmodel = new BaseCaseModel();
        $kasusmodel = new KasusModel();
        $siswamodel = new SiswaModel();
        $pernyataanmodel = new PernyataanModel();
        $psiswamodel = new PernyataanSiswaModel();
        $minatbakatmodel = new MinatBakatModel();

        // Set value data yang dikirim untuk reply / 
        // Menentukan query parameter yang diterima
        $params = $this->request->getGet();

        // Set value data yang dikirim untuk reply / respond
        $data = [];

        // Memeriksa setiap parameter dan memuat data yang sesuai
        if (empty($params)){
            $data = [
                'base_case' => $basecmodel->GetCaseBasePernyataan(),
                'kasus' => $kasusmodel->GetKasus(),
                'siswa' => $siswamodel->GetSiswa(),
                'pernyataan' => $pernyataanmodel->GetPernyataan(),
                'pernyataan siswa' => $psiswamodel->GetPernyataanSiswa()
            ];
        } else {
            foreach ($params as $param => $value) {
                switch ($param) {
                    case 'base_case':
                        $data['base_case'] = $basecmodel->GetCaseBasePernyataan();
                        break;
                    case 'kasus':
                        $data['kasus'] = $kasusmodel->GetKasus();
                        break;
                    case 'siswa':
                        $data['siswa'] = $siswamodel->GetSiswa();
                        break;
                    case 'pernyataan':
                        $data['pernyataan'] = $pernyataanmodel->GetPernyataan();
                        break;
                    case 'pernyataan_siswa':
                        $data['pernyataan_siswa'] = $psiswamodel->GetPernyataanSiswa();
                        break;
                    case 'minat_bakat':
                        $data['minat_bakat'] = $minatbakatmodel->GetMinatBakat();
                        break;
                    default:
                        break;
                }
            }
        }
        // Respon ke Request
        if ($data) {
            return $this->respond($data);
        } else {
            return $this->failNotFound('Data tidak ditemukan.');
        }
    }

    public function create()
    {
        // Ambil input dari form
        $data_siswa['umur'] = $this->request->getJSON()->umur;
        $data_siswa['jenis_kelamin'] = $this->request->getJSON()->jenis_kelamin;
        $data_siswa['kelas'] = $this->request->getJSON()->kelas;

        // Mulai transaksi
        $this->db->transStart();

        try {
            // Simpan data siswa ke tabel 'siswa'
            $siswaModel = new SiswaModel();
            $siswaModel->insertData($data_siswa);
            $id_siswa = $siswaModel->getInsertID();

            // Tambah kasus baru ke tabel 'kasus'
            $kasusModel = new KasusModel();
            $data_kasus['id_siswa'] = $id_siswa;
            $kasusModel->insertData($data_kasus);
            $id_kasus = $kasusModel->getInsertID();

            // Simpan pilihan pernyataan ke dalam tabel 'pernyataan_siswa'
            $pernyataanSiswaModel = new PernyataanSiswaModel();
            $data_pernyataansiswa['id_pernyataan'] = $this->request->getJSON()->id_pernyataan;
            $data_pernyataansiswa['id_kasus'] = $id_kasus;
            $pernyataanSiswaModel->insertData($data_pernyataansiswa);
            //$id_pernyataansiswa = $pernyataanSiswaModel->getInsertID();

            // Perhitungan Sorensen-Dice Coefficient pada data yang ada
            $basecmodel = new BaseCaseModel();
            $baseCase = $basecmodel->GetCaseBasePernyataan();
            $sdc = sdc($data_pernyataansiswa['id_pernyataan'], $baseCase);

            $kasusModel->where('id_kasus', $id_kasus)->set('id_minatbakat', $sdc[0]['id_minatbakat'])->update();

            // Commit jika semua operasi berhasil
            $this->db->transCommit();

            $data = [
                'success' => true,
                'message' => 'Data berhasil disimpan.',
                'id_siswa' => $id_siswa,
                'id_kasus' => $id_kasus,
                'umur' => $data_siswa['umur'],
                'jenis_kelamin' => $data_siswa['jenis_kelamin'],
                'kelas' => $data_siswa['kelas'],
                'minat_bakat' => $sdc[0]['minat_bakat'],
                'stimulasi' => $sdc[0]['stimulasi'],
                'hasil_sdc' => $sdc,
            ];
        } catch (\Exception $except) {
            // Rollback jika terjadi kesalahan
            $this->db->transRollback();

            $data = [
                'success' => false,
                'message' => 'Gagal menyimpan data.',
                'error' => $except->getMessage(),
            ];
        }

        return $this->respond($data);
    }
}