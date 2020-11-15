# -*- coding: utf-8 -*-
import cv2
import math
import glob
import os
import csv
import json

with open('data/01.csv', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)  # ヘッダーを読み飛ばしたい時

    for row in reader:
        page = str(row[0]).zfill(3)
        index = str(row[1]).zfill(2)

        print(page)

        # 画像１
        img1 = cv2.imread("data/target_all/1/input/"+page+".jpg")
        height, width, channels = img1.shape[:3]

        # A-KAZE検出器の生成
        akaze = cv2.AKAZE_create()  

        # 特徴量の検出と特徴量ベクトルの計算
        kp1, des1 = akaze.detectAndCompute(img1, None)

        files = glob.glob("data/temp_all/1/1-"+index+"*.tif")

        for file in sorted(files):

            opath = "data/json/"+file.split("/")[-1].replace(".tif", ".json")

            if os.path.exists(opath):
                continue

            print(file)

            # 画像２
            img2 = cv2.imread(file)
            
            kp2, des2 = akaze.detectAndCompute(img2, None)

            # Brute-Force Matcher生成
            bf = cv2.BFMatcher()

            # 特徴量ベクトル同士をBrute-Force＆KNNでマッチング
            matches = bf.knnMatch(des1, des2, k=2)

            # データを間引きする
            ratio = 0.5
            good = []
            for m, n in matches:
                if m.distance < ratio * n.distance:
                    good.append([m])

            map = {}

            for p in good:
                for px in p:
                    q_x, q_y = kp1[px.queryIdx].pt
                    t_x, t_y = kp2[px.trainIdx].pt

                    # 傾きの絶対値
                    a = (t_y - q_y) / ((t_x + width) - q_x) * 10
                    if a < 0:
                        a = a * -1

                    # 傾きの整数値
                    aa = int(a)

                    # 傾きに関するヒストグラム
                    if aa not in map:
                        map[aa] = []
                    map[aa].append(px)

            # ヒストグラムの数で再作成
            map2 = {}
            for key in map:
                map2[key] = len(map[key])
                print(str(key)+"\t"+str(map2[key]))
            
            print("----")

            # 傾きの多い順に並び替え
            map2 = sorted(map2.items(), key=lambda x:x[1], reverse=True)

            q_kp = []
            t_kp = []

            min_index = 1000000000
            min_x = 1000000
            max_index = -1
            max_x = -1

            print(map2)

            # min

            obj = map2[0]
            aa = obj[0]
            px_arr = map[aa]

            for px in px_arr:
                q_x, q_y = kp1[px.queryIdx].pt
                
                #　最も小さいX
                if min_x > q_x:
                    min_x = q_x
                    min_index = px
            
            q_kp.append(kp1[min_index.queryIdx])
            t_kp.append(kp2[min_index.trainIdx])

            # max

            obj = map2[0]
            aa = obj[0]
            px_arr = map[aa]

            for px in px_arr:
                q_x, q_y = kp1[px.queryIdx].pt

                #　最も大きいX
                if max_x < q_x:
                    max_x = q_x
                    max_index = px
            
            q_kp.append(kp1[max_index.queryIdx])
            t_kp.append(kp2[max_index.trainIdx])

            # 加工対象の画像から特徴点間の角度と距離を計算
            q_x1, q_y1 = q_kp[0].pt
            q_x2, q_y2 = q_kp[-1].pt

            q_deg = math.atan2(q_y2 - q_y1, q_x2 - q_x1) * 180 / math.pi
            q_len = math.sqrt((q_x2 - q_x1) ** 2 + (q_y2 - q_y1) ** 2)

            # テンプレート画像から特徴点間の角度と距離を計算
            t_x1, t_y1 = t_kp[0].pt
            t_x2, t_y2 = t_kp[-1].pt

            t_deg = math.atan2(t_y2 - t_y1, t_x2 - t_x1) * 180 / math.pi
            t_len = math.sqrt((t_x2 - t_x1) ** 2 + (t_y2 - t_y1) ** 2)

            if int(t_len) == 0:
                print(t_len)
                continue

            # 切出し位置の計算
            x1 = q_x1 - t_x1 * (q_len / t_len)
            x2 = x1 + img2.shape[1] * (q_len / t_len)

            y1 = q_y1 - t_y1 * (q_len / t_len)
            y2 = y1 + img2.shape[0] * (q_len / t_len)

            # 画像サイズ
            x, y, c = img1.shape
            size = (x, y)

            # 回転の中心位置
            center = (q_x1, q_y1)

            # 回転角度
            # angle = q_deg - t_deg
            angle = 0

            # サイズ比率
            scale = 1.0

            # 回転変換行列の算出
            rotation_matrix = cv2.getRotationMatrix2D(center, angle, scale)

            # アフィン変換
            img_rot = cv2.warpAffine(img1, rotation_matrix, size, flags=cv2.INTER_CUBIC)

            # 画像の切出し
            img_rot = img_rot[int(y1):int(y2), int(x1):int(x2)]

            x = int(x1)
            y = int(y1)
            w = int(x2) - x
            h = int(y2) - y

            xywh = str(x)+","+str(y)+","+str(w)+","+str(h)

            fw = open(opath, 'w')
            json.dump({"xywh": xywh}, fw, ensure_ascii=False, indent=4,
                    sort_keys=True, separators=(',', ': '))

            