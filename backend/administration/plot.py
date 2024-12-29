import matplotlib.pyplot as plt
from io import BytesIO
from .models import GPAModel
import pandas as pd
from datetime import datetime
import matplotlib

matplotlib.use("Agg")  # avoid create a new thread outside main thread


def string_to_date(date_string: str):
    return datetime.strptime(date_string, "%Y-%m-%d")


def date_to_string(date_object: datetime):
    return datetime.strftime(date_object, "%Y-%m")


def create_gpa_graph():
    gpa_data = GPAModel.objects.all().order_by("date")
    df = pd.DataFrame(
        [record.number for record in gpa_data],
        index=pd.to_datetime([record.date for record in gpa_data], errors="raise"),
        columns=["gpa"],
    )

    plt.figure(figsize=(20, 12))
    plt.grid(False)
    plt.title("My GPA")
    plt.xlabel("Date")
    plt.ylabel("GPA")
    plt.plot(df.index, df["gpa"], marker="o", linestyle="-", color="red")
    plt.tight_layout()

    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    plt.close()
    return buffer, "image/png"
