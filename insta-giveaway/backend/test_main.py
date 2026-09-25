import io
import unittest

from fastapi.testclient import TestClient
from openpyxl import Workbook

from main import app


class ImportEndpointTests(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_imports_csv_accounts(self) -> None:
        response = self.client.post(
            "/api/import",
            files={"file": ("entries.csv", b"username,avatar_url\n@mila,\nnoah,", "text/csv")},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["username"] for row in response.json()["entrants"]], ["mila", "noah"])

    def test_deduplicates_usernames_case_insensitively(self) -> None:
        response = self.client.post(
            "/api/import",
            files={
                "file": (
                    "entries.csv",
                    b"username,avatar_url\nMila,first.jpg\n @mILA ,second.jpg\ntheo,",
                    "text/csv",
                )
            },
        )

        self.assertEqual(response.status_code, 200)
        entrants = response.json()["entrants"]
        self.assertEqual([entrant["username"] for entrant in entrants], ["Mila", "theo"])

    def test_imports_xlsx_accounts(self) -> None:
        workbook = Workbook()
        worksheet = workbook.active
        worksheet.append(["instagram_username", "profile_picture_url"])
        worksheet.append(["sana", ""])
        content = io.BytesIO()
        workbook.save(content)

        response = self.client.post(
            "/api/import",
            files={
                "file": (
                    "entries.xlsx",
                    content.getvalue(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["entrants"][0]["username"], "sana")

    def test_rejects_files_without_a_username_column(self) -> None:
        response = self.client.post(
            "/api/import",
            files={"file": ("entries.csv", b"email\nuser@example.com", "text/csv")},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("username column is required", response.json()["detail"])


if __name__ == "__main__":
    unittest.main()
