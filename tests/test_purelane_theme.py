"""Purelane assignment — theme validation tests."""

from __future__ import annotations

import csv
import json
import re
import unittest
from pathlib import Path

THEME_ROOT = Path(__file__).resolve().parent.parent

REQUIRED_SECTIONS = [
    "purelane-hero",
    "purelane-shop-grid",
    "purelane-combos",
    "purelane-bundles",
    "purelane-reviews-rail",
]


def read_text(relative: str) -> str:
    return (THEME_ROOT / relative).read_text(encoding="utf-8")


def load_shopify_json(relative: str) -> dict:
    raw = read_text(relative)
    if raw.lstrip().startswith("/*"):
        raw = raw.split("*/", 1)[1]
    return json.loads(raw.lstrip())


class TestRequiredFiles(unittest.TestCase):
    def test_purelane_sections_exist(self):
        for handle in REQUIRED_SECTIONS:
            path = THEME_ROOT / "sections" / f"{handle}.liquid"
            self.assertTrue(path.is_file(), f"Missing section {handle}")

    def test_chrome_and_shell_assets(self):
        for rel in [
            "sections/purelane-header.liquid",
            "sections/purelane-footer.liquid",
            "snippets/purelane-scenes.liquid",
            "snippets/purelane-product-media.liquid",
            "assets/purelane-product-sprites.css",
            "assets/purelane-scenes.css",
            "assets/purelane-chrome.css",
            "assets/purelane-homepage.js",
        ]:
            self.assertTrue((THEME_ROOT / rel).is_file(), f"Missing {rel}")


class TestThemeBase(unittest.TestCase):
    def test_theme_base_is_dawn(self):
        schema = json.loads(read_text("config/settings_schema.json"))
        self.assertEqual(schema[0].get("theme_name", "").lower(), "dawn")


class TestIndexTemplate(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.index = load_shopify_json("templates/index.json")

    def test_section_order_matches_prototype(self):
        self.assertEqual(
            self.index["order"],
            [
                "purelane_header",
                "purelane_hero",
                "purelane_reviews",
                "purelane_combos",
                "purelane_bundles",
                "purelane_shop",
                "purelane_footer",
            ],
        )

    def test_five_core_sections_present(self):
        for key in [
            "purelane_hero",
            "purelane_shop",
            "purelane_combos",
            "purelane_bundles",
            "purelane_reviews",
        ]:
            self.assertIn(key, self.index["sections"])

    def test_hero_heading_lines(self):
        hero = self.index["sections"]["purelane_hero"]["settings"]
        self.assertEqual(hero.get("heading_line_1"), "Clean")
        self.assertEqual(hero.get("heading_line_2"), "That")
        self.assertEqual(hero.get("highlight_word"), "Lasts")


class TestProductSeed(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        path = THEME_ROOT / "notes" / "products-import.csv"
        with path.open(encoding="utf-8", newline="") as handle:
            cls.rows = list(csv.DictReader(handle))

    def test_at_least_eight_products(self):
        handles = {row["Handle"] for row in self.rows}
        self.assertGreaterEqual(len(handles), 8)

    def test_sold_out_product(self):
        sold_out = next(r for r in self.rows if r["Handle"] == "organic-dishwash-liquid-gel")
        self.assertEqual(sold_out["Variant Inventory Qty"], "0")

    def test_long_title_no_image_product(self):
        row = next(
            r
            for r in self.rows
            if r["Handle"] == "purelane-plant-powered-foaming-kitchen-cleaner-spray-extra-long-title"
        )
        self.assertGreater(len(row["Title"]), 80)
        self.assertEqual(row.get("Image Src", "").strip(), "")


class TestSectionLiquid(unittest.TestCase):
    def test_no_hardcoded_rupee_in_sections(self):
        for path in (THEME_ROOT / "sections").glob("purelane-*.liquid"):
            text = path.read_text(encoding="utf-8")
            self.assertNotIn("₹", text, f"Hardcoded rupee in {path.name}")
            self.assertNotIn("&#8377;", text, f"Hardcoded rupee entity in {path.name}")

    def test_shop_grid_uses_dawn_cart(self):
        js = read_text("assets/purelane-shop-grid.js")
        self.assertIn("PUB_SUB_EVENTS.cartUpdate", js)

    def test_product_sprites_loaded(self):
        styles = read_text("snippets/purelane-styles.liquid")
        self.assertIn("purelane-product-sprites.css", styles)

    def test_reviews_marquee_a11y(self):
        text = read_text("sections/purelane-reviews-rail.liquid")
        self.assertIn("aria-hidden", text)


if __name__ == "__main__":
    unittest.main()
