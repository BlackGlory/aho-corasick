use daachorse::charwise::CharwiseDoubleArrayAhoCorasick as DoubleArrayAhoCorasick;
use neon::prelude::*;

struct JsAhoCorasick {
    ac: DoubleArrayAhoCorasick<u8>,
    case_sensitive: bool,
}

impl Finalize for JsAhoCorasick {}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("createAhoCorasick", create_aho_corasick)?;
    cx.export_function("isMatch", is_match)?;
    cx.export_function("findAll", find_all)?;

    Ok(())
}

// createAhoCorasick(
//   patterns: string[]
// , options: { caseSensitive: boolean }
// ): NativeAhoCorasick
fn create_aho_corasick(mut cx: FunctionContext) -> JsResult<JsBox<JsAhoCorasick>> {
    let patterns = cx.argument::<JsArray>(0)?;
    let mut patterns = js_array_to_vec_string(&mut cx, patterns)?;

    let options = cx.argument::<JsObject>(1)?;
    let case_sensitive = options
        .get::<JsBoolean, _, _>(&mut cx, "caseSensitive")?
        .value(&mut cx);

    if !case_sensitive {
        patterns = patterns
            .into_iter()
            .map(|x| x.to_lowercase())
            .collect();
    }

    match DoubleArrayAhoCorasick::new(patterns) {
        Ok(ac) => Ok(cx.boxed(JsAhoCorasick {
            ac,
            case_sensitive,
        })),
        Err(err) => cx.throw_error(err.to_string())
    }
}

// isMatch(ac: NativeAhoCorasick, text: string): boolean
fn is_match(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let instance = cx.argument::<JsBox<JsAhoCorasick>>(0)?;
    let ac = &instance.ac;
    let case_sensitive = instance.case_sensitive;

    let text = cx.argument::<JsString>(1)?;
    let mut text = js_string_to_string(&mut cx, text)?;

    if !case_sensitive {
        text = text.to_lowercase();
    }

    let result: bool = ac.find_overlapping_iter(&text).next().is_some();

    Ok(cx.boolean(result))
}

// findAll(ac: NativeAhoCorasick, text: string): string[]
fn find_all(mut cx: FunctionContext) -> JsResult<JsArray> {
    let instance = cx.argument::<JsBox<JsAhoCorasick>>(0)?;
    let ac = &instance.ac;
    let case_sensitive = instance.case_sensitive;

    let text = cx.argument::<JsString>(1)?;
    let text = js_string_to_string(&mut cx, text)?;

    let mut matches = vec![];
    if case_sensitive {
        for mat in ac.find_overlapping_iter(&text) {
            matches.push(&text[mat.start()..mat.end()]);
        }
    } else {
        for mat in ac.find_overlapping_iter(&text.to_lowercase()) {
            matches.push(&text[mat.start()..mat.end()]);
        }
    }
    matches.sort_unstable();
    matches.dedup();

    let js_array = vec_string_to_js_array(&mut cx, matches)?;

    Ok(js_array)
}

fn vec_string_to_js_array<'a>(
    cx: &mut FunctionContext<'a>,
    list: Vec<&str>
) -> NeonResult<Handle<'a, JsArray>> {
    let result = JsArray::new(cx, list.len() as u32);
    for (i, val) in list.into_iter().enumerate() {
        let js_string = cx.string(val);
        result.set(cx, i as u32, js_string)?;
    }

    Ok(result)
}

fn js_array_to_vec_string(
    cx: &mut FunctionContext,
    arr: Handle<JsArray>,
) -> NeonResult<Vec<String>> {
    let result = arr
        .to_vec(cx)?
        .into_iter()
        .map(|x| {
            x.downcast::<JsString, _>(cx)
                .or_throw(cx)
                .map(|x| x.value(cx))
        })
        .collect::<Result<Vec<_>, _>>()?;

    Ok(result)
}

fn js_string_to_string(
    cx: &mut FunctionContext,
    val: Handle<JsString>
) -> NeonResult<String> {
    let result = val
        .downcast::<JsString, _>(cx)
        .or_throw(cx)?
        .value(cx);

    Ok(result)
}
