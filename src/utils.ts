export function byKey<T>(
  key: keyof T,
  order: "asc" | "desc" = "asc"
): (a: T, b: T) => number {
  return function (a, b) {
    var x = a[key];
    var y = b[key];
    let flip = 1;
    if (order === "desc") {
      flip = -1;
    }
    return (x < y ? -1 : x > y ? 1 : 0) * flip;
  };
}
