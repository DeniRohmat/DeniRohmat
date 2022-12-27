<?php

use Restserver\Libraries\REST_Controller;

defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';


class Produk extends REST_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->model('Produk_model', 'produk');
    }

    function list_post()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header('Content-Type: application/json');


        $search = $this->input->post('search', TRUE);
        $limit = $this->input->post('limit', TRUE);
        $start = $this->input->post('start', TRUE);

        $produk = $this->produk->fetch_data($limit, $start, $search);
        if ($produk->num_rows() == 0 && $this->input->post('start') == 0) {
            $result = 0;
        } else {
            $result = 1;
        }

        if ($produk->num_rows() > 0) {
            $this->response([
                'status' => TRUE,
                'data' => $produk->result(),
                'result' => $result,
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'status' => FALSE,
                'message' => 'Tiket tidak ditemukan',
                'result' => $result
            ], REST_Controller::HTTP_OK);
        }
    }
    public function simpan_post()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods:POST");
        header('Content-Type: application/json');

        $id = $this->input->post('id', TRUE);

        if (!empty($_FILES['image']['tmp_name'])) {
            $errors = array();
            $allowed_ext = array('jpg', 'jpeg', 'png',);

            $file_size = $_FILES['image']['size'];
            $file_tmp = $_FILES['image']['tmp_name'];

            $type = pathinfo($file_tmp, PATHINFO_EXTENSION);
            $data = file_get_contents($file_tmp);

            $tmp = explode('.', $_FILES['image']['name']);
            $file_ext = end($tmp);


            if (in_array($file_ext, $allowed_ext) === false) {
                $errors[] = 'Ekstensi file tidak di izinkan';
                echo json_encode(['status' => false, 'message' => 'Ekstensi file tidak di izinkan']);
                die();
            }

            if ($file_size > 2097152) {
                $errors[] = 'Ukuran file maksimal 2 MB';
                echo json_encode(['status' => false, 'message' => 'Ukuran file maksimal 2 MB']);
                die();
            }


            if (empty($errors)) {
                $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                $data = [
                    'nama'  => $this->input->post('nama', TRUE),
                    'harga' => $this->input->post('harga', TRUE),
                    'deskripsi' => $this->input->post('deskripsi', TRUE),
                    'img'   => $base64
                ];
            } else {
                echo json_encode($errors);
            }
        } else {
            $data = [
                'nama' => $this->input->post('nama', TRUE),
                'harga' => $this->input->post('harga', TRUE),
                'deskripsi' => $this->input->post('deskripsi', TRUE),
            ];
        }

        if ($id == "") {
            $this->db->insert('produk', $data);
            $msg = "Data Tiket Konser berhasil ditambahkan";
        } else {
            $this->db->where('id', $id);
            $this->db->update('produk', $data);
            $msg = "Data barang berhasil diubah";
        }

        echo json_encode(['status' => true, 'message' => $msg]);
    }

    public function detail_get($id)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET");
        header('Content-Type: application/json');

        $produk = $this->db->get_where('produk', ['id' => $id]);
        if ($produk->num_rows() > 0) {
            $this->response([
                'status' => TRUE,
                'data' => $produk->row()
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'status' => FALSE,
                'message' => 'Tiket tidak ditemukan'
            ], REST_Controller::HTTP_OK);
        }
    }

    public function hapus_get($id)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET");
        header('Content-Type: application/json');
        $this->db->where('id', $id);
        $this->db->delete('produk');
        echo json_encode(['status' => true, 'message' => 'Data Tiket berhasil dihapus']);
    }
    public function bayar_get($id)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET");
        header('Content-Type: application/json');
        $this->db->where('id', $id);
        $this->db->delete('produk');
        echo json_encode(['status' => true, 'message' => 'Pembayaran Berhasil dilakukan']);
    }
}
