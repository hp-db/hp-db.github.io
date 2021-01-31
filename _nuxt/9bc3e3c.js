(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{714:function(t,_,v){"use strict";v.r(_);var e={data:function(){return{baseUrl:"https://moeller.jinsha.tsukuba.ac.jp"}},head:function(){return{title:"About"}}},n=v(73),r=v(86),l=v.n(r),o=v(439),c=v(160),component=Object(n.a)(e,(function(){var t=this,_=t.$createElement,v=t._self._c||_;return v("div",[v("v-container",{staticClass:"my-5"},[v("h1",{staticClass:"mb-5"},[t._v(t._s(t.$t("manual"))+" : "+t._s(t.$t("検索画面")))]),t._v(" "),v("h2",{staticClass:"my-5"},[t._v(t._s(t.$t("対象データ")))]),t._v(" "),v("ul",[v("li",[t._v("\n        本データベースはGeorg Möller, "),v("i",[t._v("Hieratische Paläographie")]),t._v(", 3\n        volumes, 1909–12.\n        (以下，『ヒエラティック古書体学』と呼びます)に掲載されている字形リストを検索するシステムです．\n      ")]),t._v(" "),v("li",[t._v("\n        2021年1月31日現在，第1巻〜第3巻の基本字（1~613bis），数字類（614~719），連字（I~LXXVII）を収録しています．\n      ")]),t._v(" "),v("li",[t._v("\n        『ヒエラティック古書体学』の画像の元データには，東京大学アジア研究図書館デジタルライブラリーが"),v("a",{attrs:{href:"https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/asia/dres?sort_by=uparl%3AidentifierOfTheData&sort_order=asc"}},[t._v("Digital Resources for Egyptian Studies")]),t._v("にて提供するIIIF画像を使用しています．\n      ")]),t._v(" "),v("li",[t._v("\n        IIIF画像の切り出し及び表示には，人文学オープンデータ共同利用センターが提供する"),v("a",{attrs:{href:"http://codh.rois.ac.jp/iiif/curation/"}},[t._v("Curation API")]),t._v("，"),v("a",{attrs:{href:"http://codh.rois.ac.jp/software/iiif-curation-viewer/"}},[t._v("IIIF Curation Viewer")]),t._v("，"),v("a",{attrs:{href:"http://codh.rois.ac.jp/iiif-curation-platform/"}},[t._v("IIIF Curation Platform")]),t._v("を使用しています．\n      ")])]),t._v(" "),v("h2",{staticClass:"my-5"},[t._v(t._s(t.$t("検索画面")))]),t._v(" "),v("v-img",{attrs:{src:t.baseUrl+"/img/icons/search.png",width:"100%",contain:""}}),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[1] "+t._s(t.$t("メニューバー")))]),t._v(" "),v("p",[t._v("\n      「Home」，「検索」，「カテゴリー」，「ユーザズガイド」等を選択することができます．\n    ")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[2] "+t._s(t.$t("全文検索")))]),t._v(" "),v("p",[t._v("サイト全体を検索します．")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[3] "+t._s(t.$t("language")))]),t._v(" "),v("p",[t._v("表示言語（ENGLISH/日本語）の切り替えを行うことができます．")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[4] "+t._s(t.$t("Item Type")))]),t._v(" "),v("p",[t._v("\n      基本字（1~613bis），連字（I~LXXVII），数字類（614~719）を選択することができます．\n    ")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[5] "+t._s(t.$t("Sub Type")))]),t._v(" "),v("p",[t._v("\n      数字類（614~719）の下位分類として「数詞」，「日付」，「分数」，「尺」，「面積」，「体積」を選択することができます．\n    ")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[6] "+t._s(t.$t("Unit")))]),t._v(" "),v("p",[t._v("\n      「単字」と「連字」を選択することができます．「単字」は文字が単独で使用されたものです．「連字」は２つ以上の文字が連続して書かれたものです．\n    ")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[7] "+t._s(t.$t("Item Label")))]),t._v(" "),v("p",[t._v("\n      『ヒエラティック古書体学』に掲載されているアイテム番号（データの見出しとして使用されている番号）で検索します．アイテム番号を入力して検索すると，下位区分を含めた結果が示されます．例えば，“192”で検索すると，“192,\n      192B, 192C”が示されます．\n    ")]),t._v(" "),v("ul",[v("li",[v("nuxt-link",{attrs:{to:t.localePath({name:"category-id",params:{id:"Item Label Mod"}})}},[t._v("アイテム番号一覧")])],1)]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[8] "+t._s(t.$t("Hieratic No")))]),t._v(" "),v("p",[t._v("\n      ヒエラティック番号で検索することできます．ヒエラティックは原則としてアイテム番号と一致しています．ただし，一部のアイテムについては，名寄せ（統合）と名分け（分割）を行うなど，本サイトで独自に設定したものとなっています．\n    ")]),t._v(" "),v("ul",[v("li",[v("nuxt-link",{attrs:{to:t.localePath({name:"category-id",params:{id:"Hieratic No Mod"}})}},[t._v("ヒエラティック番号一覧")])],1)]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[9] 分類クラス")]),t._v(" "),v("p",[t._v("\n      ヒエログリフ番号に付されている分類クラスを絞り込むことができます．分類クラスとは，ヒエログリフ番号の最初に付されているアルファベットを言います．A〜Z（Jを除く），Aaの26種類となります．\n    ")]),t._v(" "),v("ul",[v("li",[v("nuxt-link",{attrs:{to:t.localePath({name:"category-id",params:{id:"Category Class"}})}},[t._v("分類クラス一覧")])],1)]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[10] ヒエログリフ番号")]),t._v(" "),v("p",[t._v("\n      ヒエログリフ番号からヒエラティックを検索することができます．本データベースで使用するヒエログリフ番号は以下の番号に従っています．\n    ")]),t._v(" "),v("ul",[v("li",[v("a",{attrs:{href:"https://en.wikipedia.org/wiki/Gardiner%27s_sign_list"}},[t._v("Gardiner's sign list._Wikipedia")])]),t._v(" "),v("li",[v("a",{attrs:{href:"https://hieroglyphes.pagesperso-orange.fr/Hieroglyphica = A.htm"}},[t._v("HIEROGLYPHICA")])])]),t._v(" "),v("p",{staticClass:"mt-5"},[t._v("\n      ただし，一部の文字については独自に補助記号を与えています．ヒエログリフ番号による検索では，G17，Aa2など「分類クラス（アルファベット）＋数字」を入力して下さい．分類クラス（アルファベット）のみの入力ではデータがヒットしません．\n    ")]),t._v(" "),v("ul",[v("li",[v("nuxt-link",{attrs:{to:t.localePath({name:"category-id",params:{id:"Hieroglyph No Mod"}})}},[t._v("ヒエログリフ番号一覧")])],1)]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[11] "+t._s(t.$t("Phone/Word")))]),t._v(" "),v("p",[t._v("\n      音価や単語からヒエラティックを検索することができます．検索では，Manuel\n      de\n      Codage（MdC）方式によるアルファベット（半角，英，大文字，小文字）を入力して下さい．例えば，"),v("span",{staticClass:"phone"},[t._v("Ax")]),t._v("を検索する際には，Axと入力することになります．なお，本データベースでは文字配列のための補助記号（:）(*）や形態素境界記号（.）(=)は使用しておりません．子音転写の表示にはTransliterationフォントを使用しています．\n    ")]),t._v(" "),v("ul",[v("li",[v("a",{attrs:{href:"http://www.catchpenny.org/codage/#trans"}},[t._v("Manuel de Codage（MdC）")])]),t._v(" "),v("li",[v("a",{attrs:{href:"http://wwwuser.gwdg.de/~lingaeg/bin/glyph_i.zip"}},[t._v("True Type Font “Transliteration” (The Centre For Computer-aided\n          Egyptological Research)")])])]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[12] 数詞")]),t._v(" "),v("p",[t._v("数詞でヒエラティックを検索することができます．")]),t._v(" "),v("ul",[v("li",[v("nuxt-link",{attrs:{to:t.localePath({name:"category-id",params:{id:"Numeral"}})}},[t._v("数詞一覧")])],1)]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[13] 巻数")]),t._v(" "),v("p",[t._v("『ヒエラティック古書体学』の巻数を指定することができます．")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[14] ページ")]),t._v(" "),v("p",[t._v("\n      『ヒエラティック古書体学』の本文のページを指定することができます．指定できるのは特定の１ページのみとなります．\n    ")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[15] 順番")]),t._v(" "),v("p",[t._v("\n      『ヒエラティック古書体学』のページ内における文字種の配列順番を指定することができます．\n    ")]),t._v(" "),v("h3",{staticClass:"my-5"},[t._v("[16] 備考")]),t._v(" "),v("p",[t._v("備考に記入された情報を検索することができます．")])],1)],1)}),[],!1,null,null,null);_.default=component.exports;l()(component,{VContainer:o.a,VImg:c.a})}}]);